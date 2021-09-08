<?php


namespace App\Services;

use Illuminate\Support\Facades\Auth;

class UserService {

    public function updateUser($request, $user) {

        $currentUser = Auth::user();

        if ($user->id != $currentUser["id"]) {
            return abort(404);
        }

        $currentUser->username = $request->username;
        $currentUser->email = $request->email;

        $currentUser->save();
    }

}
