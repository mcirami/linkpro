<?php

namespace App\Http\Controllers;

use App\Models\LandingPage;
use App\Services\LandingPageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class LandingPageController extends Controller
{
    public function show() {

    }

    public function store() {
        $user = Auth::user();

        $landingPage = $user->landingPages()->create([]);

        return redirect('/course-manager/landing-page/' . $landingPage->id);
    }

    public function edit(LandingPage $landingPage) {

        $user = Auth::user();

        if ($landingPage->user_id != $user["id"]) {
            return abort(404);
        }

        Javascript::put([
            'landingPage' => $landingPage->attributesToArray()
        ]);
        return view('landing-page.edit');
    }

    public function saveLogo(Request $request, LandingPage $landingPage, LandingPageService $service) {

        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }

        $imagePath = $service->savePageLogo($userID, $request);

        $landingPage->update(['logo' => $imagePath]);

        return response()->json(['message' => 'Logo Updated', 'imagePath' => $imagePath]);
    }

    public function saveSlogan(Request $request, LandingPage $landingPage) {

        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }

        $key = collect($request->all())->keys();
        $message = ucfirst($key[0]) . " Updated";

        $landingPage->update([$key[0] => $request[$key[0]] ]);

        return response()->json(['message' => $message]);
    }
}
