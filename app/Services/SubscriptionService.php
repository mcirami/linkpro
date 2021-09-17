<?php


namespace App\Services;


use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Cashier\Billable;

class SubscriptionService {

    use Billable;

    /*protected $user;

    public function __construct() {

        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();

            return $next($request);
        });
    }*/

    public function showPurchasePage() {

        $plan = isset($_GET["plan"]) ? $_GET["plan"] : null;

        return $plan;
    }

    public function showPlansPage() {
        $subscription = null;

        $user = Auth::user();

        if ($user->subscribed('pro') || $user->subscribed('corporate') ){
            $subscription = $user->subscriptions()->first();
        }

        return $subscription;
    }

    public function newSubscription($request) {

        $request->user()->newSubscription(
            $request->level,
            $request->plan
        )->create($request->paymentMethod, ['name' => $request->cardholderName]);

        return "Thank you for subscribing!";
    }

    public function updateSubscription($request) {

        $user = Auth::user();

        $activeSubs = $user->subscriptions()->active()->get();

        $user->subscription($activeSubs[0]->name)->noProrate()->swap($request->plan);

        if($request->level == "corporate") {
            $message = "Your plan has been upgraded to the Corporate level";
            $user->subscriptions($activeSubs[0]->name)->update(['name' => "corporate"]);
        } else {
            $message = "Your plan has been downgraded to the Pro level";
            $user->subscriptions($activeSubs[0]->name)->update(['name' => "pro"]);
        }

        return $message;
    }

    public function cancelSubscription($request) {
        $user = Auth::user();

        $user->subscription($request->plan_name)->cancel();

    }

    public function resumeSubscription($request) {
        $user = Auth::user();

        $user->subscription($request->plan_name)->resume();

    }
}
