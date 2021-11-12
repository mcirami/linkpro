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
}
