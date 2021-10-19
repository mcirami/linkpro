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

        $data = $subscriptionService->newSubscription($request);

        $user = Auth::user();
        $page = $user->pages()->where('user_id', $user["id"])->where('default', true)->get();

        if ($data["success"] == true) {
            return redirect()->route('pages.edit', [$page])->with( ['success' => $data["message"]] );
        } else {
            return back()->withErrors($data["message"]);
        }

    }

    public function changePlan(Request $request, SubscriptionService $subscriptionService) {

        $path = $request->session()->get('_previous');

        $data = $subscriptionService->updateSubscription($request);

        if( (str_contains($path["url"], '/subscribe') || str_contains($path["url"], '/plans') ) && $data["success"] == true ) {
            $user = Auth::user();
            $page = $user->pages()->where('user_id', $user["id"])->where('default', true)->get();

            return redirect()->route('pages.edit', [$page])->with(['success' => $data["message"]]);


        } else {
            if ($data["success"] == true) {
                return redirect()->back()->with(['success' => $data["message"]]);
            }
        }

        return back()->withErrors($data["message"]);

    }

    public function plans(Request $request, SubscriptionService $subscriptionService) {

        $path = $request->session()->get('_previous');

        $subscription = $subscriptionService->showPlansPage();

        return view('subscription.plans', ['subscription' => $subscription, 'path' => $path["url"]]);
    }

    public function cancel(Request $request, SubscriptionService $subscriptionService) {

        $data = $subscriptionService->cancelSubscription($request);

        if ($data["success"] == true) {
            return redirect()->back()->with(['success' => $data["message"]]);
        } else {
            return back()->withErrors($data["message"]);
        }
    }

    public function resume(Request $request, SubscriptionService $subscriptionService) {

        $subscriptionService->resumeSubscription($request);

        return redirect()->back()->with(['success' => 'Your Subscription Has Been Reactivated']);
    }
}
