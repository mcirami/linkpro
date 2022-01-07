<?php

namespace App\Http\Controllers;

use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Traits\SubscriptionTrait;

class SubscriptionController extends Controller
{
    use SubscriptionTrait;

    /**
     * @param SubscriptionService $subscriptionService
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function purchase(SubscriptionService $subscriptionService) {

        $data = $subscriptionService->showPurchasePage();

        return view('subscription.index', [ 'plan' => $data['plan'], 'token' => $data['token'], 'amount' => $data["amount"], 'existing' => $data["existing"] ]);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, SubscriptionService $subscriptionService) {


        $data = $subscriptionService->newSubscription($request);

        $user = Auth::user();
        $page = $user->pages()->where('user_id', $user["id"])->where('default', true)->get();

        if ($data["success"]) {
            return redirect()->route('pages.edit', [$page[0]->id])->with( ['success' => $data["message"]] );
        } elseif($data["bypass"]) {
            $newData = $subscriptionService->createManualSubscription($request->discountCode);

            if($newData["success"]) {
                return redirect()->route('pages.edit', [$page[0]->id])->with( ['success' => $newData["message"]] );
            }

        } else {
            return back()->withErrors($data["message"]);
        }
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function changePlan(Request $request, SubscriptionService $subscriptionService) {

        $path = $request->session()->get('_previous');

        $data = $subscriptionService->updateSubscription($request);

        if( (str_contains($path["url"], '/subscribe') || str_contains($path["url"], '/plans') ) && $data["success"] == true ) {
            $user = Auth::user();
            $page = $user->pages()->where('user_id', $user["id"])->where('default', true)->get();

            return redirect()->route('pages.edit', [$page[0]->id])->with(['success' => $data["message"]]);


        } else {
            if ($data["success"] == true) {
                return redirect()->back()->with(['success' => $data["message"]]);
            }
        }

        return back()->withErrors($data["message"]);

    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function plans(Request $request, SubscriptionService $subscriptionService) {

        $path = $request->session()->get('_previous');

        $subscription = $subscriptionService->showPlansPage();

        return view('subscription.plans', ['subscription' => $subscription, 'path' => $path["url"]]);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancel(Request $request, SubscriptionService $subscriptionService) {

        $data = $subscriptionService->cancelSubscription($request);

        if ($data["success"] == true) {
            return redirect()->back()->with(['success' => $data["message"]]);
        } else {
            return back()->withErrors($data["message"]);
        }
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function resume(Request $request, SubscriptionService $subscriptionService) {

        $data = $subscriptionService->resumeSubscription($request);

        if ($data["success"] == true) {
            return redirect()->back()->with(['success' => $data["message"]]);
        } else {
            return back()->withErrors($data["message"]);
        }

    }

    public function checkCode(Request $request) {

        $planID = $request->planId;
        $code = $request->code;

        $match = $this->checkPromoCode($planID, $code);

        if ($match) {
            if ( $planID == "premier" && strtolower( $code ) == "premier6months" ) {
                $message = "Congrats! Your 6 Month Premier Membership is activated!";
            } elseif ( $planID == "premier" && strtolower( $code ) == "premier1month" ) {
                $message = "Congrats! Your 1 Month Premier Membership is activated!";
            } elseif($planID == "premier" && strtolower( $code ) == "premier4life") {
                $message = "Congrats! Your Lifetime Premier Membership is activated!";
            } elseif ( $planID == "pro" && strtolower( $code ) == "pro6months" ) {
                $message = "Congrats! Your 6 Month Pro Membership is activated!";
            } elseif ( $planID == "pro" && strtolower( $code ) == "pro1month" ) {
                $message = "Congrats! Your 1 Month Pro Membership is activated!";
            } elseif ( $planID == "pro" && strtolower( $code ) == "pro4life" ) {
                $message = "Congrats! Your Lifetime Pro Membership is activated!";
            }

            $success = true;

        } else {
            $message = "Sorry, promo code does not match";
            $success = false;
        }

        return response()->json(['success' => $success,'message' => $message]);

    }
}
