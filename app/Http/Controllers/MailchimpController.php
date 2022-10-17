<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;
use Laravel\Socialite\Facades\Socialite;
use MailchimpMarketing\ApiClient;

class MailchimpController extends Controller
{

    public function auth() {
        return Socialite::driver('mailchimp')->redirect();
    }

    public function callback() {

        //$user = Socialite::driver('mailchimp')->userFromToken('6356eddb53ba852ecf305acd6d77e1b1');

        try {

            $mailchimpUser = Socialite::driver('mailchimp')->user();
            $token = $mailchimpUser->accessTokenResponseBody["access_token"];
            $dc = $mailchimpUser->user["dc"];

            $mailchimp = new ApiClient();
            $mailchimp->setConfig([
                'accessToken' => $token,
                'server' => $dc
            ]);

            $response = $mailchimp->lists->getAllLists();
            $lists = $response->lists;

            $listArray = [];

            foreach($lists as $list) {

                $listObject = [
                    'list_id' => $list->id,
                    'list_name' => $list->name
                ];

                array_push($listArray, $listObject);
            }

            $user = Auth::user();

            $user->update([
                'mailchimp_token' => $token,
                'mailchimp_server' => $dc,
                'mailchimp_lists' => json_encode($listArray)
            ]);

            return redirect()->route('dashboard', ['redirected' => "mailchimp"]);

        } catch (\Throwable $th) {
            dd('Something went wrong! '. $th->getMessage());
        }
    }

    public function getLists() {

        $user = Auth::user();

        return response()->json( ['lists' => json_decode($user->mailchimp_lists)]);
    }
}