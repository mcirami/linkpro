<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function edit() {

        return view('users.edit', [
           'user' => Auth::user()
        ]);
    }

    public function update(Request $request) {

        //always want full hex code
        $request->validate([
            'background' => 'required|size:7|starts_with:#',
            'text_color' => 'required|size:7|starts_with:#',
        ]);

        Auth::user()->update($request->only(['background', 'text_color']));

        return redirect()->back()->with(['success' => 'Changes saved successfully']);
    }

    public function show(User $user) {
        $user->load('links');

        return view('users.show', [
            'user' => $user
        ]);
    }
}
