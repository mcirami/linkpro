<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function edit() {

        return view('users.edit', [
           'user' => Auth::user(),
            'success' => "my message"
        ]);
    }

    public function update(UpdateUserRequest $request, UserService $userService, User $user) {

        $userService->updateUser($request, $user);

        return redirect()->back()->with(['success' => 'Changes saved successfully']);
    }

    public function show(User $user) {
        $user->load('links');

        return view('users.show', [
            'user' => $user
        ]);
    }
}
