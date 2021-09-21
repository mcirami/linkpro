<?php

namespace App\Http\Controllers;

use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Cashier\Billable;


class SubscriptionController extends Controller
{
    use Billable;

    public function purchase(SubscriptionService $subscriptionService) {

        $plan = $subscriptionService->showPurchasePage();

        return view('subscription.index', [ 'intent' => auth()->user()->createSetupIntent(), 'plan' => $plan ]);
    }

    public function store(Request $request, SubscriptionService $subscriptionService) {

        $message = $subscriptionService->newSubscription($request);

        return view('subscription.confirmation', ['message' => $message]);
    }

    public function changePlan(Request $request, SubscriptionService $subscriptionService) {

        $message = $subscriptionService->updateSubscription($request);

        //return view('subscription.confirmation', ['message' => $message]);

        return redirect()->back()->with(['success' => $message]);
    }

    public function plans(SubscriptionService $subscriptionService) {

        $subscription = $subscriptionService->showPlansPage();

        return view('subscription.plans', ['subscription' => $subscription]);
    }

    public function cancel(Request $request, SubscriptionService $subscriptionService) {

        $subscriptionService->cancelSubscription($request);

        return redirect()->back()->with(['success' => 'Your Subscription Has Been Cancelled']);

    }

    public function resume(Request $request, SubscriptionService $subscriptionService) {

        $subscriptionService->resumeSubscription($request);

        return redirect()->back()->with(['success' => 'Your Subscription Has Been Reactivated']);
    }
}
