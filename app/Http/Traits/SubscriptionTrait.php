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

        if ( $planID == "premier" && strtolower( $userCode ) == "6freepremier" ) {
            $match = "6FreePremier";
        } elseif ( $planID == "premier" && strtolower( $userCode ) == "1freepremier" ) {
            $match = "1FreePremier";
        } elseif($planID == "premier" && strtolower( $userCode ) == "freepremier") {
            $match = "bypass";
        } elseif ( $planID == "pro" && strtolower( $userCode ) == "6freepro" ) {
            $match = "6FreePro";
        } elseif ( $planID == "pro" && strtolower( $userCode ) == "1freepro" ) {
            $match = "1FreePro";
        } elseif ( $planID == "pro" && strtolower( $userCode ) == "freepro" ) {
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
