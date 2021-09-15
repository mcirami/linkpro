<?php

namespace App\Http\Controllers;

use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Cashier\Billable;


class SubscriptionController extends Controller
{
    use Billable;

    protected $user;

    public function __construct() {

        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();

            return $next($request);
        });
    }

    public function show(SubscriptionService $subscriptionService) {

        $plan = $subscriptionService->showSubscription();

        return view('subscription.index', [ 'intent' => auth()->user()->createSetupIntent(), 'plan' => $plan ]);
    }

    public function store(Request $request, SubscriptionService $subscriptionService) {

        $message = $subscriptionService->newSubscription($request);

        return view('subscription.confirmation', ['message' => $message]);
    }

    public function changePlan(Request $request, SubscriptionService $subscriptionService) {

        $message = $subscriptionService->updateSubscription($request);

        return view('subscription.confirmation', ['message' => $message]);
    }

    public function plans() {

        /*$page = $this->user->pages()->firstWhere('user_id', $this->user["id"]);*/

        $subscription = null;

        if ($this->user->subscribed('pro') || $this->user->subscribed('corporate') ){
            $getSubscription = $this->user->subscriptions()->first()->pluck("name");
            $subscription = $getSubscription[0];
        }

        return view('subscription.plans', ['subscription' => $subscription]);
    }
}
