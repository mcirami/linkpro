<?php


namespace App\Services;

use Braintree\Gateway;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class UserService {

    public function getUserInfo() {

        $user = Auth::user();
        $subscription = $user->subscriptions()->first() ? : null;
        $paymentMethod = $user["pm_type"] ? : null;

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
        } else {
            $token = $gateway->ClientToken()->generate();
        }
        //$token = $gateway->ClientToken()->generate();

        $data = [
            'user' => $user,
            'subscription' => $subscription,
            'payment_method' => $paymentMethod,
            'token' => $token,
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

        //$customer = $gateway->customer()->find($customerID);
       // $postalCode = $customer->addresses[0]->postalCode;

        //$token = $customer->paymentMethods[0]->token;

        $updateResult = $gateway->paymentMethod()->create([
            'customerId' => $customerID,
            'paymentMethodNonce' => $request->payment_method_nonce,
            'options' => [
                'makeDefault' => true
            ]
        ]);

        if ($updateResult->success) {

            $paymentClass = strtolower(get_class($updateResult->paymentMethod));
            $paymentToken = $updateResult->paymentMethod->token;

            $subscription = $user->subscriptions()->first();

            $result = $gateway->subscription()->update($subscription->braintree_id, [
                'paymentMethodToken' => $paymentToken,
            ]);

            if ($result->success) {

                if ( str_contains( $paymentClass, "creditcard" ) ) {
                    //$paymentMethod = $customer->customer->paymentMethods[0]->cardType;
                    $paymentMethod      = "card";
                    $user->pm_last_four = $updateResult->paymentMethod->last4;;
                } elseif ( str_contains( $paymentClass, "paypal" ) ) {
                    $paymentMethod      = "paypal";
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
}
