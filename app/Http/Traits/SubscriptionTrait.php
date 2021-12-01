<?php

namespace App\Http\Traits;
use Braintree\Gateway;

trait SubscriptionTrait {

    /**
     *
     * Create new Braintree Gateway for Subscriptions
     *
     * @return Gateway
     *
     */

    public function createGateway() {

        $gateway = new Gateway([
            'environment' => config('services.braintree.environment'),
            'merchantId' => config('services.braintree.merchantId'),
            'publicKey' => config('services.braintree.publicKey'),
            'privateKey' => config('services.braintree.privateKey')
        ]);

        return $gateway;
    }

    public function checkPromoCode($planID, $userCode) {

        if ( $planID == "premier" && strtolower( $userCode ) == "premier6months" ) {
            $match = "Premier6Months";
        } elseif($planID == "premier" && strtolower( $userCode ) == "lppremium4life") {
            $match = "LPPremium4Life";
        } elseif ( $planID == "pro" && strtolower( $userCode ) == "pro6months" ) {
            $match = "Pro6Months";
        } elseif ( $planID == "pro" && strtolower( $userCode ) == "pro1month" ) {
            $match = "Pro1Month";
        } else {
            $match = null;
        }

        return $match;
    }
}
