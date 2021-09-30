<?php

namespace App\Http\Controllers;

use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
//use Laravel\Cashier\Billable;


class SubscriptionController extends Controller
{
    //use Billable;

    public function purchase(SubscriptionService $subscriptionService) {

        $data = $subscriptionService->showPurchasePage();

        //return view('subscription.index', [ 'intent' => $data['intent'], 'plan' => $data['plan'], 'paymentIntent' => $data['paymentIntent'] ]);

        return view('subscription.index', [ 'plan' => $data['plan'], 'token' => $data['token'], 'amount' => $data["amount"] ]);
    }

    public function store(Request $request, SubscriptionService $subscriptionService) {

        $message = $subscriptionService->newSubscription($request);

        $user = Auth::user();
        $page = $user->pages()->firstWhere('user_id', $user["id"]);
        return redirect()->route('pages.edit', [$page])->with(['success' => $message]);
    }

    public function changePlan(Request $request, SubscriptionService $subscriptionService) {

        $path = $request->session()->get('_previous');

        $message = $subscriptionService->updateSubscription($request);

        if(str_contains($path["url"], '/plans')) {
            $user = Auth::user();
            $page = $user->pages()->firstWhere('user_id', $user["id"]);
            return redirect()->route('pages.edit', [$page])->with(['success' => $message]);
        } else {
            return redirect()->back()->with(['success' => $message]);
        }

    }

    public function plans(Request $request, SubscriptionService $subscriptionService) {

        $path = $request->session()->get('_previous');

        $subscription = $subscriptionService->showPlansPage();

        return view('subscription.plans', ['subscription' => $subscription, 'path' => $path["url"]]);
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
