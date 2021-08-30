<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Cashier\Billable;


class SubscriptionController extends Controller
{
    use Billable;

    public function show() {

        $plan = $_GET["plan"];

        return view('subscription.index', ['intent' => auth()->user()->createSetupIntent(), 'plan' => $plan]);
    }

    public function store(Request $request) {

        $user = Auth::user();
        $page = $user->pages()->firstWhere('user_id', $user["id"]);

        $request->user()->newSubscription(
            $request->level , $request->plan
        )->create($request->paymentMethod);

        return redirect('/dashboard/pages/' .  $page->id);

    }

    public function upgrade() {
        $user = Auth::user();
        $page = $user->pages()->firstWhere('user_id', $user["id"]);

        $subscription = null;

        if ($user->subscribed('pro') || $user->subscribed('corporate') ){
            $getSubscription = $user->subscriptions()->first()->pluck("name");
            $subscription = $getSubscription[0];
        }

        return view('subscription.upgrade', ['page_id' => $page->id, 'subscription' => $subscription]);
    }
}
