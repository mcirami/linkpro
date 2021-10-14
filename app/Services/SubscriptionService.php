<?php


namespace App\Services;


use App\Models\User;
use App\Notifications\NotifyAboutCancelation;
use App\Notifications\NotifyAboutUpgrade;
use App\Notifications\WelcomeNotification;
use Illuminate\Support\Facades\Auth;
//use Laravel\Cashier\Billable;
//use Stripe\Stripe;
use Braintree\Gateway;
use function PHPUnit\Framework\isEmpty;

class SubscriptionService {

    //use Billable;

    /*protected $user;

    public function __construct() {

        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();

            return $next($request);
        });
    }*/

    public function showPurchasePage() {

        $gateway = new Gateway([
            'environment' => config('services.braintree.environment'),
            'merchantId' => config('services.braintree.merchantId'),
            'publicKey' => config('services.braintree.publicKey'),
            'privateKey' => config('services.braintree.privateKey')
        ]);

        $token = $gateway->ClientToken()->generate();

        $plan = isset($_GET["plan"]) ? $_GET["plan"] : null;

        if ($plan == "pro") {
            $amount = 4.99;
        } else {
            $amount = 19.99;
        }

        $data = [
            'plan' => $plan,
            'token' => $token,
            'amount' => $amount
        ];

        return $data;
    }

    public function showPlansPage() {

        $user = Auth::user();

        $subscription = $user->subscriptions()->first();

        if (empty($subscription)) {
            $subscription = null;
        }

        return $subscription;
    }

    public function newSubscription($request) {

        $user = Auth::user();

        $gateway = new Gateway([
            'environment' => config('services.braintree.environment'),
            'merchantId' => config('services.braintree.merchantId'),
            'publicKey' => config('services.braintree.publicKey'),
            'privateKey' => config('services.braintree.privateKey')
        ]);

        $nonce = $request->payment_method_nonce;

        $customer = $gateway->customer()->create([
           'email' => $user->email,
           'paymentMethodNonce' => $nonce
        ]);

        if ($customer->success) {

            $result = $gateway->subscription()->create([
                'paymentMethodToken' => $customer->customer->paymentMethods[0]->token,
                'planId' => $request->planId,
            ]);

            if ($result->success) {

                $user->subscriptions()->create([
                    'name' => $result->subscription->planId,
                    'braintree_id' => $result->subscription->id,
                    'braintree_status' => strtolower($result->subscription->status),
                ]);

                $paymentClass = strtolower(get_class($customer->customer->paymentMethods[0]));

                if (str_contains($paymentClass, "creditcard")) {
                    //$paymentMethod = $customer->customer->paymentMethods[0]->cardType;
                    $paymentMethod = "card";
                    $user->pm_last_four = $customer->customer->paymentMethods[0]->last4;
                } elseif (str_contains($paymentClass, "paypal")) {
                    $paymentMethod = "paypal";
                    $user->pm_last_four = NULL;
                }

                $user->pm_type = $paymentMethod;
                $user->braintree_id = $customer->customer->id;
                $user->save();

                if ($request->level == "pro") {
                    $plan = "PRO";
                } else {
                    $plan = "Corporate";
                }

                $userData = ([
                    'siteUrl' => \URL::to('/') . "/",
                    'plan' => $plan,
                ]);

                $user->notify(new NotifyAboutUpgrade($userData));

                $message = "Your plan has been changed to the " . $request->level . " level";

            } else {
                $errorString = "";

                foreach ($result->errors->deepAll() as $error) {
                    $errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
                }

                // $_SESSION["errors"] = $errorString;
                // header("Location: index.php");
                return back()->withErrors('An error occurred with the message: '. $result->message);
            }

        } else {
            foreach($customer->errors->deepAll() AS $error) {
                echo($error->code . ": " . $error->message . "\n");
            }

            return back()->withErrors('An error occurred with the message: '. $customer->message);
        }

       return $message;

    }

    public function updateSubscription($request) {

        $user = Auth::user();

        $activeSubs = $user->subscriptions()->first();

        //$user->subscription($activeSubs[0]->name)->noProrate()->swap($request->plan);
        $gateway = new Gateway([
            'environment' => config('services.braintree.environment'),
            'merchantId' => config('services.braintree.merchantId'),
            'publicKey' => config('services.braintree.publicKey'),
            'privateKey' => config('services.braintree.privateKey')
        ]);

        if($request->level == "corporate") {

            $result = $gateway->subscription()->update($activeSubs->braintree_id, [
                'price' => '19.99',
                'planId' => 'corporate'
            ]);

            if ($result->success) {
                $activeSubs->update(['name' => "corporate"]);

                $userData = ([
                    'siteUrl' => \URL::to('/') . "/",
                    'plan' => 'Corporate',
                ]);

                $user->notify(new NotifyAboutUpgrade($userData));

            } else {
                $errorString = "";

                foreach ($result->errors->deepAll() as $error) {
                    $errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
                }

                // $_SESSION["errors"] = $errorString;
                // header("Location: index.php");
                return back()->withErrors('An error occurred with the message: '. $result->message);
            }

            $message = "Your plan has been upgraded to the Corporate level";


        } else {
            $result = $gateway->subscription()->update($activeSubs->braintree_id, [
                'price' => '4.99',
                'planId' => 'pro'
            ]);

            if ($result->success) {
                $activeSubs->update(['name' => "pro"]);

                $userPages = $user->pages()->get();

                foreach ($userPages as $userPage) {
                    if ($userPage->is_protected) {
                        $userPage->is_protected = 0;
                        $userPage->password = null;
                    }

                    if ($request->defaultPage) {
                        if ($request->defaultPage == $userPage->id) {
                            $userPage->default = true;
                        } else {
                            $userPage->default = false;
                            $userPage->disabled = true;
                        }
                    }

                    $userPage->save();
                }

                /*$userData = ([
                    'siteUrl' => \URL::to('/') . "/",
                    'plan' => 'Corporate',
                ]);

                $user->notify(new NotifyAboutUpgrade($userData));*/

                $message = "Your plan has been downgraded to the Pro level";
            } else {
                $errorString = "";

                foreach ($result->errors->deepAll() as $error) {
                    $errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
                }

                // $_SESSION["errors"] = $errorString;
                // header("Location: index.php");
                return back()->withErrors('An error occurred with the message: '. $result->message);
            }


        }

        return $message;
    }

    public function cancelSubscription($request) {
        $user = Auth::user();

        $gateway = new Gateway([
            'environment' => config('services.braintree.environment'),
            'merchantId' => config('services.braintree.merchantId'),
            'publicKey' => config('services.braintree.publicKey'),
            'privateKey' => config('services.braintree.privateKey')
        ]);

        $result = $gateway->subscription()->cancel($request->plan);

        if ($result->success) {
            $subscription = $user->subscriptions()->first();
            $subscription->braintree_status = strtolower($result->subscription->status);
            $subscription->ends_at = $result->subscription->billingPeriodEndDate;
            $subscription->save();

            $userData = ([
                'siteUrl' => \URL::to('/') . "/",
                'end_date' => $result->subscription->billingPeriodEndDate->format('F j, Y'),
            ]);

            $user->notify(new NotifyAboutCancelation($userData));

            /*$userData = ([
                'siteUrl' => \URL::to('/') . "/",
                'plan' => 'Corporate',
            ]);

            $user->notify(new NotifyAboutUpgrade($userData));*/
        } else {
            $errorString = "";

            foreach ($result->errors->deepAll() as $error) {
                $errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
            }

            // $_SESSION["errors"] = $errorString;
            // header("Location: index.php");
            return back()->withErrors('An error occurred with the message: '. $result->message);
        }

    }

    public function resumeSubscription($request) {
        $user = Auth::user();

        $activeSubs = $user->subscriptions()->first();

        $activeSubs->name             = $result->subscription->planId;
        $activeSubs->braintree_id     = $result->subscription->id;
        $activeSubs->braintree_status = strtolower( $result->subscription->status );
        $activeSubs->save();


    }
}
