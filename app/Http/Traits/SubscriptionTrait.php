<?php

namespace App\Http\Traits;
use App\Models\Referral;
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
        } elseif ( $planID == "premier" && strtolower( $userCode ) == "premier1month" ) {
            $match = "Premier1Month";
        } elseif($planID == "premier" && strtolower( $userCode ) == "premier4life") {
            $match = "bypass";
        } elseif ( $planID == "pro" && strtolower( $userCode ) == "pro6months" ) {
            $match = "Pro6Months";
        } elseif ( $planID == "pro" && strtolower( $userCode ) == "pro1month" ) {
            $match = "Pro1Month";
        } elseif ( $planID == "pro" && strtolower( $userCode ) == "pro4life" ) {
            $match = "bypass";
        } else {
            $match = null;
        }

        return $match;
    }

    public function addReferralSubID($user, $subscriptionID) {

        $referral = Referral::where('referral_id', $user->id)->get();

        if ($referral->isNotEmpty()) {
            $referral[0]->update(['subscription_id' => $subscriptionID]);
        }

    }
}
