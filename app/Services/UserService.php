<?php


namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class UserService {

    public function getUserInfo() {

        $user = Auth::user();

        $subscription = $user->subscriptions()->first() ? : null;
        $paymentMethod = $user->defaultPaymentMethod() ? : null;

        $data = [
            'user' => $user,
            'subscription' => $subscription,
            'payment_method' => $paymentMethod
        ];

        Javascript::put([
            'user_info' => $user,
        ]);

        return $data;
    }

    public function updateUserInfo($request, $user) {

        $currentUser = Auth::user();

        if ($user->id != $currentUser["id"]) {
            return abort(404);
        }

        $currentUser->username = $request->username;
        $currentUser->email = $request->email;

        $currentUser->save();
    }

    public function updateUserAvatar($request, $user) {

        if($request->get('profile_img')) {
            $image = $request->get('profile_img');
            $name = time() . '.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            $img = Image::make($request->get('profile_img'));
            $path = "/avatars/" . $request->user_id . "/" . $name;
            Storage::put('/public' . $path, $img->stream());
        }

        $user->update(['avatar' => "/storage" . $path]);
    }
}
