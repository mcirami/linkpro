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

        /*Stripe::setApiKey(env("STRIPE_SECRET"));

        $plan = isset($_GET["plan"]) ? $_GET["plan"] : null;
        $intent = auth()->user()->createSetupIntent();

        if ($plan == "pro") {
            $amount = 499;
        } else {
            $amount = 1999;
        }

        $paymentIntent = \Stripe\PaymentIntent::create([
            'amount' => $amount,
            'currency' => 'usd',
        ]);

        $data = [
            'plan' => $plan,
            'intent' => $intent,
            'paymentIntent' => $paymentIntent,
        ];*/

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

       /* $request->user()->newSubscription(
            $request->level,
            $request->plan
        )->create($request->paymentMethod);*/


        $gateway = new Gateway([
            'environment' => config('services.braintree.environment'),
            'merchantId' => config('services.braintree.merchantId'),
            'publicKey' => config('services.braintree.publicKey'),
            'privateKey' => config('services.braintree.privateKey')
        ]);

        $nonce = $request->payment_method_nonce;

        $customer = $gateway->customer()->create([
           'firstName' => 'Billy',
           'lastName' => "Bob",
           'email' => $user->email,
           'paymentMethodNonce' => $nonce
        ]);

        if ($customer->success) {

            $result = $gateway->subscription()->create([
                'paymentMethodToken' => $customer->customer->paymentMethods[0]->token,
                'planId' => $request->planId,
            ]);

            if ($result->success) {
                //$transaction = $result->transaction;
                // header("Location: transaction.php?id=" . $transaction->id);

                //return back()->with('success_message', 'Transaction successful. The ID is:'. $transaction->id);
                $message = "Your plan has been changed to " . $request->level;

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
                $user->braintree_id = $result->subscription->id;
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

                return $message;

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
        }

        /***
         *
         * $customer->paymentMethods[0]->token;
        *  $customer->paymentMethods[0]->last4;
         *
         */


        /*$result = $gateway->transaction()->sale([
            'amount' => $amount,
            'paymentMethodNonce' => $nonce,
            'customer' => [
                'firstName' => 'Tony',
                'lastName' => 'Stark',
                'email' => $user->email,
            ],
            'options' => [
                'submitForSettlement' => true
            ]
        ]);*/

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

            $message = "Your plan has been downgraded to the Pro level";
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

            $userData = (['end_data' => $result->subscription->billingPeriodEndDate->format('F j, Y')]);

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

        $user->subscription($request->plan)->resume();

    }
}
