<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function show(User $user) {
        $user->load('links');

        return view('users.show', [
            'user' => $user
        ]);
    }

    public function edit(UserService $userService) {

        $data = $userService->getUserInfo();

        return view('users.edit', [
            'user' => $data['user'],
            'subscription' => $data["subscription"],
            'payment_method' => $data["payment_method"],
            'token' => $data['token'],
        ]);
    }

    public function updateAccountInfo(UpdateUserRequest $request, UserService $userService, User $user) {

        $userService->updateUserInfo($request, $user);

        return redirect()->back()->with(['success' => 'Changes saved successfully']);
    }

    public function updateCard(Request $request, UserService $userService) {


        /*if ($request->user_id != $user["id"]) {
            return abort(404);
        }*/

        $userService->updateCard($request);

        return redirect()->back()->with(['success' => 'Credit Card Updated']);

    }

}
