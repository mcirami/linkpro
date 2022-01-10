<?php


namespace App\Services;

use App\Http\Controllers\Controller;
use App\Notifications\NotifyAboutCancelation;
use App\Notifications\NotifyAboutResumeSub;
use App\Notifications\NotifyAboutUpgrade;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Http\Traits\SubscriptionTrait;
use App\Http\Traits\UserTrait;

class SubscriptionService {

    use SubscriptionTrait, UserTrait;

    private $user;

    /**
     * @param $user
     */
    public function __construct() {
        $this->user = Auth::user();

        return $this->user;
    }

    /**
     *
     * Get subscription information to purchase and generate client token
     *
     * @return array
     */
    public function showPurchasePage() {

        $activeSubs = $this->getUserSubscriptions($this->user);
        if (empty($activeSubs)) {
            $existing = null;
        } else {
            $existing = true;
        }

        $gateway = $this->createGateway();

        $customerID = $this->user->braintree_id;

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

    /**
     * Check if user has subscription and return current if true
     *
     * @return mixed|null
     */
    public function showPlansPage() {

        $subscription = $this->getUserSubscriptions($this->user);

        if (empty($subscription)) {
            $subscription = null;
        }

        return $subscription;
    }

    /**
     * create new user Braintree customer and subscription
     *
     *
     * @param $request
     *
     * @return array
     */
    public function newSubscription($request) {

        $code     = null;
        $userCode = $request->discountCode;
        $planID   = $request->planId;

        if ( $userCode ) {

            $code = $this->checkPromoCode($planID, $userCode);

            if (!$code) {

                return [
                    "success" => false,
<<<<<<< HEAD
                    "message" => "Sorry, discount code does not match"
=======
                    "message" => "Sorry, promo code does not match"
>>>>>>> parent of 8060d6a... fixed conflict
                ];

            } elseif ($code == "bypass") {

                return [
                    "success" => false,
                    "bypass" => true,
                ];
            }
        }

        $gateway = $this->createGateway();

        $nonce = $request->payment_method_nonce;

        $customer = $gateway->customer()->create( [
            'email'              => $this->user->email,
            'paymentMethodNonce' => $nonce
        ] );

        if ( $customer->success ) {

            if ( $code ) {
                $result = $gateway->subscription()->create( [
                    'paymentMethodToken' => $customer->customer->paymentMethods[0]->token,
                    'planId'             => $planID,
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
                    'planId'             => $planID,
                ] );
            }

            if ( $result->success ) {

                $this->user->subscriptions()->create( [
                    'name'             => $result->subscription->planId,
                    'braintree_id'     => $result->subscription->id,
                    'braintree_status' => strtolower( $result->subscription->status ),
                ] );

                $paymentMethod = strtolower( get_class( $customer->customer->paymentMethods[0] ) );
                //$paymentMethod = $result->subscription->transactions[0]->paymentInstrumentType;

                if (str_contains($paymentMethod, "credit") ) {
                    //$paymentMethod = $customer->customer->paymentMethods[0]->cardType;
                    $this->user->pm_last_four = $customer->customer->paymentMethods[0]->last4;
                } else {
                    $this->user->pm_last_four = null;
                }

                $this->user->pm_type      = $paymentMethod;
                $this->user->braintree_id = $customer->customer->id;
                $this->user->save();

                if ( $request->level == "pro" ) {
                    $plan = "PRO";
                } else {
                    $plan = "Premier";
                }

                if ($this->user->email_subscription) {

                    $userData = ( [
                        'plan'    => $plan,
                        'userID'  => $this->user->id,
                    ] );

                    $this->user->notify( new NotifyAboutUpgrade( $userData ) );
                }

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

    /**
     *
     * Update user subscription level
     *
     * @param $request
     *
     * @return array
     */
    public function updateSubscription($request) {

        $activeSubs = $this->getUserSubscriptions($this->user);

        $gateway = $this->createGateway();

        if($request->level == "premier") {

            $result = $gateway->subscription()->update($activeSubs->braintree_id, [
                'price' => '19.99',
                'planId' => 'premier'
            ]);

            if ($result->success) {
                $activeSubs->update(['name' => "premier"]);

                $userPages = $this->getUserPages($this->user);

                if (count($userPages) > 1) {
                    foreach ($userPages as $userPage) {
                        if ( $userPage->disabled ) {
                            $userPage->disabled = false;
                            $userPage->save();
                        }
                    }
                }

                if ($this->user->email_subscription) {

                    $userData = ( [
                        'plan'    => 'Premier',
                        'userID'  => $this->user->id,
                    ] );

                    $this->user->notify( new NotifyAboutUpgrade( $userData ) );
                }

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

                $userPages = $this->getUserPages($this->user);

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
                                $this->user->update(['username' => $userPage->name]);
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

    /**
     *
     * Cancel subscription and update user access to content
     *
     * @param $request
     *
     * @return array
     */
    public function cancelSubscription($request) {

        $gateway = $this->createGateway();

        $result = $gateway->subscription()->cancel($request->plan);

        if ($result->success) {

            if ($result->subscription->billingPeriodEndDate) {
                $endDateDB = $result->subscription->billingPeriodEndDate;
                $endDateMail = $result->subscription->billingPeriodEndDate->format( 'F j, Y' );
            } else {
                $time = $result->subscription->nextBillingDate->sub(new \DateInterval('P1D'));
                $endDateDB = $time->format('Y-m-d H:i:s');
                $endDateMail = $time->format( 'F j, Y' );
            }

            $subscription = $this->getUserSubscriptions($this->user);
            $subscription->braintree_status = strtolower($result->subscription->status);
            $subscription->ends_at = $endDateDB;
            $subscription->save();

            if ($this->user->email_subscription) {

                $userData = ( [
                    'end_date' => $endDateMail,
                    'userID'   => $this->user->id,
                ] );

                $this->user->notify( new NotifyAboutCancelation( $userData ) );
            }

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

    /**
     *
     * Resume subscription by creating new subscription and setting start date to previous subscription end date
     * If previous subscription has expired then create new subscription without end date
     *
     * @param $request
     *
     * @return array
     */
    public function resumeSubscription($request) {

        $activeSubs = $this->getUserSubscriptions($this->user);
        $planID   = $request->planId;
        $timestamp = NULL;
        $expired = false;
        $userCode = $request->discountCode;

        $gateway = $this->createGateway();

        if ($activeSubs->ends_at > Carbon::now()) {
            $token = $request->payment_method_token;
            $timestamp = strtotime($activeSubs->ends_at);
            $timestamp += 60*60*24;
            $billingDate = date('Y-m-d H:i:s', $timestamp);

            $result = $gateway->subscription()->create( [
                'paymentMethodToken' => $token,
                'planId'             => $planID,
                'firstBillingDate'  => $billingDate,
            ] );
        } else {

            $nonce = $request->payment_method_nonce;

            if ( $userCode ) {

                $code = $this->checkPromoCode($planID, $userCode);

                if ($code) {
                    $result = $gateway->subscription()->create( [
                        'paymentMethodNonce' => $nonce,
                        'planId'             => $planID,
                        'discounts'          => [
                            'add' => [
                                [
                                    'inheritedFromId' => $code,
                                ]
                            ]
                        ]
                    ] );
                } else {
                    $data = [
                        "success" => false,
                        "message" => "Sorry, discount code does not match"
                    ];

                    return $data;
                }

            } else {
                $result = $gateway->subscription()->create( [
                    'paymentMethodNonce' => $nonce,
                    'planId'             => $planID,
                ] );
            }

            $expired = true;
        }

        if ( $result->success ) {

            $activeSubs->name             = $result->subscription->planId;
            $activeSubs->braintree_id     = $result->subscription->id;
            $activeSubs->braintree_status = strtolower( $result->subscription->status );
            $activeSubs->ends_at          = NULL;
            $activeSubs->save();

            if ($this->user->email_subscription) {

                $userData = ( [
                    'userID'  => $this->user->id,
                    'username' => $this->user->username,
                    'link' => $this->getDefaultUserPage($this->user)[0],
                    'billingDate' =>  $timestamp ? date('F j, Y', $timestamp) : null,
                ] );

                $this->user->notify( new NotifyAboutResumeSub( $userData ) );
            }

            if ($expired && $planID == 'premier') {
                $this->enableUsersPages($this->user);
            }

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

    public function createManualSubscription($code) {

        if (strtolower( $code ) == "premier4life") {
            $subName = "premier";
        } else {
            $subName = "pro";
        }

        $this->user->subscriptions()->create( [
            'name'             => $subName,
            'braintree_id'     => "bypass",
            'braintree_status' => "active",
        ] );

        $this->user->update(["braintree_id" => "bypass"]);

        if ($this->user->email_subscription) {

            $userData = ( [
                'plan'    => $subName,
                'userID'  => $this->user->id,
            ] );

            $this->user->notify( new NotifyAboutUpgrade( $userData ) );
        }

        return [
            "success" => true,
            "message" => "Your account has been upgraded!"
        ];

    }
}
