<?php


namespace App\Services;

use App\Notifications\NotifyAboutUnsubscribe;
use Braintree\Gateway;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class UserService {

    public function getUserInfo() {

        $user = Auth::user();
        $subscription = $user->subscriptions()->first() ? : null;
        $paymentMethod = $user["pm_type"] ? : null;
        $paymentMethodToken = null;

        $gateway = new Gateway([
            'environment' => config('services.braintree.environment'),
            'merchantId' => config('services.braintree.merchantId'),
            'publicKey' => config('services.braintree.publicKey'),
            'privateKey' => config('services.braintree.privateKey')
        ]);

        $customerID = $user->braintree_id;

        if ($customerID) {
            $token = $gateway->ClientToken()->generate([
                'customerId' => $customerID
            ]);

            if ($subscription->ends_at && $subscription->ends_at > Carbon::now()) {

                $customer = $gateway->customer()->find( $customerID );

                foreach ( $customer->paymentMethods as $payment_method ) {
                    if ( $payment_method->default ) {
                        $paymentMethodToken = $payment_method->token;
                    }
                }
            }

        } else {
            $token = $gateway->ClientToken()->generate();
        }

        $data = [
            'user' => $user,
            'subscription' => $subscription,
            'payment_method' => $paymentMethod,
            'token' => $token,
            'payment_method_token' => $paymentMethodToken
        ];

        Javascript::put([
            'user_info' => $user,
        ]);

        return $data;
    }

    public function updateUserInfo($request, $user) {

        $currentUser = Auth::user();

        if ($user->id != $currentUser["id"]) {
            return abort(404);
        }

        $currentUser->username = $request->username;
        $currentUser->email = $request->email;

        $currentUser->save();
    }

    public function updateCard($request) {

        $user = Auth::user();

        $customerID = $user->braintree_id;

        $gateway = new Gateway([
            'environment' => config('services.braintree.environment'),
            'merchantId' => config('services.braintree.merchantId'),
            'publicKey' => config('services.braintree.publicKey'),
            'privateKey' => config('services.braintree.privateKey')
        ]);

        $customer = $gateway->customer()->find($customerID);

        if ($customer) {

            $token = $customer->paymentMethods[0]->token;

            $result = $gateway->customer()->update(
                $customerID,
                [
                    'paymentMethodNonce' => $request->payment_method_nonce,
                    'creditCard' => [
                        'options' => [
                            'updateExistingToken' => $token
                        ],
                        'billingAddress' => [
                            'postalCode' => '63304',
                            'options' => [
                                'updateExisting' => true
                            ]
                        ]
                    ],

                ]
            );


            if ($result->success) {

                $user->pm_last_four = $result->customer->paymentMethods[0]->last4;
                $user->save();

            } else {
                $errorString = "";

                foreach ($result->errors->deepAll() as $error) {
                    $errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
                }

                return back()->withErrors('An error occurred with the message: '. $result->message);
            }

        } else {

            foreach($customer->errors->deepAll() AS $error) {
                echo($error->code . ": " . $error->message . "\n");
            }

            return back()->withErrors('An error occurred with the message: '. $customer->message);
        }
    }

    public function updatePaymentMethod($request) {

        $user = Auth::user();

        $customerID = $user->braintree_id;

        $gateway = new Gateway([
            'environment' => config('services.braintree.environment'),
            'merchantId' => config('services.braintree.merchantId'),
            'publicKey' => config('services.braintree.publicKey'),
            'privateKey' => config('services.braintree.privateKey')
        ]);

        $updateResult = $gateway->paymentMethod()->create([
            'customerId' => $customerID,
            'paymentMethodNonce' => $request->payment_method_nonce,
            'options' => [
                'makeDefault' => true
            ]
        ]);

        if ($updateResult->success) {

            $paymentToken = $updateResult->paymentMethod->token;
            $subscription = $user->subscriptions()->first();

            $result = $gateway->subscription()->update($subscription->braintree_id, [
                'paymentMethodToken' => $paymentToken,
            ]);

            if ($result->success) {

                $paymentMethod = $request->pm_type;

                if ( $request->pm_last_four ) {
                    $user->pm_last_four = $request->pm_last_four;
                } else {
                    $user->pm_last_four = null;
                }

                $user->pm_type = $paymentMethod;
                $user->save();

            } else {
                foreach($result->errors->deepAll() AS $error) {
                    echo($error->code . ": " . $error->message . "\n");
                }

                return back()->withErrors('An error occurred with the message: '. $result->message);
            }

        } else {

            foreach($updateResult->errors->deepAll() AS $error) {
                echo($error->code . ": " . $error->message . "\n");
            }

            return back()->withErrors('An error occurred with the message: '. $updateResult->message);
        }

    }

    public function handleEmailSubscription($user) {

        $action = $_GET["action"];

       if ($action == "unsubscribe") {
           $user->email_subscription = false;
           $user->save();

           $data = [
               "subscribed" => false,
               "message" => "You have been unsubscribed from our email notifications..."
           ];

           $userData = ([
               'siteUrl' => \URL::to('/'),
               'subject' => 'You have been UnSubscribed',
               'userID'  => $user["id"],
           ]);

           $user->notify(new NotifyAboutUnsubscribe($userData));

       } else {
           $user->email_subscription = true;
           $user->save();

           $data = [
               "subscribed" => true,
               "message" => "Thank you for subscribing!"
           ];
       }

       return $data;

    }
}
