<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    public function show() {

        $plan = $_GET["plan"];

        return view('subscription.index', ['intent' => auth()->user()->createSetupIntent(), 'plan' => $plan]);
    }

    public function store(Request $request) {

        //dd($request->all());

        $request->user()->newSubscription(
            $request->level , $request->plan
        )->create($request->paymentMethod);

        return redirect('/');

    }

    public function upgrade() {
        $user = Auth::user();
        $page = $user->pages()->firstWhere('user_id', $user["id"]);
        //return redirect('/dashboard/pages/' . $page->id);

        return view('subscription.upgrade', ['page_id' => $page->id]);
    }
}
