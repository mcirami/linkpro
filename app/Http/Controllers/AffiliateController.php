<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class AffiliateController extends Controller
{
    public function show() {

        Javascript::put([
            'user_info' => Auth::user(),
        ]);

        return view('affiliate.show');
    }

    public function store(Request $request) {

        $user = Auth::user();

        DB::table('affiliates')->insert([
            'user_id'   => $user->id,
            'status'    => 'approved'
        ]);

        return redirect()->back()->with(['success' => true]);
    }
}
