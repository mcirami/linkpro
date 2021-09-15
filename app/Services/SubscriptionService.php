<?php


namespace App\Services;


use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Cashier\Billable;

class SubscriptionService {

    use Billable;

    public function showSubscription() {

        $user = Auth::user();

        $plan = $_GET["plan"];

       /* $activeSubs = $user->subscriptions()->active()->get();

        if($activeSubs->isEmpty()) {
            $sub = null;
        } else {
            $sub = $activeSubs[0]->name;
        }

        $data = [
            'plan' => $plan,
            'sub_name' => $sub
        ];*/

        return $plan;

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

    public function cancelSubscription() {

    }
}
