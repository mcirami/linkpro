<?php


namespace App\Services;

use App\Notifications\NotifyAboutCancelation;
use App\Notifications\NotifyAboutUpgrade;
use Illuminate\Support\Facades\Auth;
use Braintree\Gateway;

class SubscriptionService {

    public function showPurchasePage() {

        $user = Auth::user();
        $activeSubs = $user->subscriptions()->first();
        if (empty($activeSubs)) {
            $existing = null;
        } else {
            $existing = true;
        }

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

        $plan = isset($_GET["plan"]) ? $_GET["plan"] : null;

        if ($plan == "pro") {
            $amount = 4.99;
        } else {
            $amount = 19.99;
        }

        $data = [
            'plan' => $plan,
            'token' => $token,
            'amount' => $amount,
            'existing' => $existing
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
        $code     = null;
        $userCode = $request->discountCode;
        $planID   = $request->planId;

        if ( $userCode ) {

            if ( $planID == "premier" && strtolower( $userCode ) == "premier6months" ) {
                $code = "Premier6Months";
            } elseif ( $planID == "pro" && strtolower( $userCode ) == "pro6months" ) {
                $code = "Pro6Months";
            } else {
                $data = [
                    "success" => false,
                    "message" => "Sorry, discount code does not match"
                ];

                return $data;
            }
        }

        $gateway = new Gateway( [
            'environment' => config( 'services.braintree.environment' ),
            'merchantId'  => config( 'services.braintree.merchantId' ),
            'publicKey'   => config( 'services.braintree.publicKey' ),
            'privateKey'  => config( 'services.braintree.privateKey' )
        ] );

        $nonce = $request->payment_method_nonce;

        $customer = $gateway->customer()->create( [
            'email'              => $user->email,
            'paymentMethodNonce' => $nonce
        ] );

        if ( $customer->success ) {

            if ( $code ) {
                $result = $gateway->subscription()->create( [
                    'paymentMethodToken' => $customer->customer->paymentMethods[0]->token,
                    'planId'             => $request->planId,
                    'discounts'          => [
                        'add' => [
                            [
                                'inheritedFromId' => $code,
                            ]
                        ]
                    ]
                ] );
            } else {
                $result = $gateway->subscription()->create( [
                    'paymentMethodToken' => $customer->customer->paymentMethods[0]->token,
                    'planId'             => $request->planId,
                ] );
            }

            if ( $result->success ) {

                $user->subscriptions()->create( [
                    'name'             => $result->subscription->planId,
                    'braintree_id'     => $result->subscription->id,
                    'braintree_status' => strtolower( $result->subscription->status ),
                ] );

                //$paymentClass = strtolower( get_class( $customer->customer->paymentMethods[0] ) );
                $paymentMethod = $result->subscription->transactions[0]->paymentInstrumentType;

                if ($paymentMethod == "credit_card") {
                    //$paymentMethod = $customer->customer->paymentMethods[0]->cardType;
                    $user->pm_last_four = $customer->customer->paymentMethods[0]->last4;
                } else {
                    $user->pm_last_four = null;
                }

                $user->pm_type      = $paymentMethod;
                $user->braintree_id = $customer->customer->id;
                $user->save();

                if ( $request->level == "pro" ) {
                    $plan = "PRO";
                } else {
                    $plan = "Premier";
                }

                $userData = ( [
                    'siteUrl' => \URL::to( '/' ) . "/",
                    'plan'    => $plan,
                ] );

                $user->notify( new NotifyAboutUpgrade( $userData ) );

                $data = [
                    "success" => true,
                    "message" => "Your plan has been changed to the " . $request->level . " level"
                ];

            } else {
                $errorString = "";

                foreach ( $result->errors->deepAll() as $error ) {
                    $errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
                }

                $data = [
                    "success" => false,
                    "message" => 'An error occurred with the message: ' . $result->message
                ];
            }

        } else {
            foreach ( $customer->errors->deepAll() as $error ) {
                echo( $error->code . ": " . $error->message . "\n" );
            }

            $data = [
                "success" => false,
                "message" => 'An error occurred with the message: ' . $customer->message
            ];
        }

        return $data;

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

        if($request->level == "premier") {

            $result = $gateway->subscription()->update($activeSubs->braintree_id, [
                'price' => '19.99',
                'planId' => 'premier'
            ]);

            if ($result->success) {
                $activeSubs->update(['name' => "premier"]);

                $userPages = $user->pages()->get();

                if (count($userPages) > 1) {
                    foreach ($userPages as $userPage) {
                        if ( $userPage->disabled ) {
                            $userPage->disabled = false;
                            $userPage->save();
                        }
                    }
                }

                $userData = ([
                    'siteUrl' => \URL::to('/') . "/",
                    'plan' => 'Premier',
                ]);

                $user->notify(new NotifyAboutUpgrade($userData));

                $data = [
                    "success" => true,
                    "message" => "Your plan has been upgraded to the Premier level"
                ];

            } else {
                $errorString = "";

                foreach ($result->errors->deepAll() as $error) {
                    $errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
                }

                $data = [
                    "success" => false,
                    "message" => 'An error occurred with the message: '. $result->message
                ];
                //return back()->withErrors('An error occurred with the message: '. $result->message);
            }


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

                    if (count($userPages) > 1) {

                        if ( $request->defaultPage ) {
                            if ( $request->defaultPage == $userPage->id ) {
                                $userPage->default  = true;
                                $userPage->disabled = false;
                            } else {
                                $userPage->default  = false;
                                $userPage->disabled = true;
                            }
                        }
                    }

                    $userPage->save();
                }

                $data = [
                    "success" => true,
                    "message" => "Your plan has been downgraded to the Pro level"
                ];

            } else {
                $errorString = "";

                foreach ($result->errors->deepAll() as $error) {
                    $errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
                }

                $data = [
                    "success" => false,
                    "message" => 'An error occurred with the message: '. $result->message
                ];
            }


        }

        return $data;
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

            $data = [
                "success" => true,
                "message" => "Your Subscription Has Been Cancelled"
            ];

        } else {
            $errorString = "";

            foreach ($result->errors->deepAll() as $error) {
                $errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
            }

            $data = [
                "success" => false,
                "message" => 'An error occurred with the message: '. $result->message
            ];
        }

        return $data;

    }

    public function resumeSubscription($request) {

        $user = Auth::user();
        //$code     = null;
        $activeSubs = $user->subscriptions()->first();
        //$userCode = $request->discountCode;
        $planID   = $request->planId;
        $token = $request->payment_method_token;

        $gateway = new Gateway([
            'environment' => config('services.braintree.environment'),
            'merchantId' => config('services.braintree.merchantId'),
            'publicKey' => config('services.braintree.publicKey'),
            'privateKey' => config('services.braintree.privateKey')
        ]);

        $timestamp = strtotime($activeSubs->ends_at);
        $timestamp += 60*60*24;
        $billingDate = date('Y-m-d H:i:s', $timestamp);

        $result = $gateway->subscription()->create( [
            'paymentMethodToken' => $token,
            'planId'             => $planID,
            'firstBillingDate'  => $billingDate,
        ] );


        if ( $result->success ) {

            $activeSubs->name             = $result->subscription->planId;
            $activeSubs->braintree_id     = $result->subscription->id;
            $activeSubs->braintree_status = strtolower( $result->subscription->status );
            $activeSubs->ends_at          = NULL;
            $activeSubs->save();

            if ( $request->level == "pro" ) {
                $plan = "PRO";
            } else {
                $plan = "Premier";
            }

            $userData = ( [
                'siteUrl' => \URL::to( '/' ) . "/",
                'plan'    => $plan,
            ] );

            $user->notify( new NotifyAboutUpgrade( $userData ) );

            $data = [
                "success" => true,
                "message" => "Your subscription has been resumed"
            ];

        } else {
            $errorString = "";

            foreach ( $result->errors->deepAll() as $error ) {
                $errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
            }

            $data = [
                "success" => false,
                "message" => 'An error occurred with the message: ' . $result->message
            ];
        }

        return $data;

    }
}
