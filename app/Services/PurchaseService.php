<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Http\Traits\SubscriptionTrait;

class PurchaseService {

    use SubscriptionTrait;

    public function purchase($offer, $request, $gateway) {

        $result = $gateway->transaction()->sale([
            'amount' => $offer->price,
            'paymentMethodNonce' => $request->payment_method_nonce,
            'options' => [
                'submitForSettlement' => True
            ]
        ]);

        if ($result->success) {

            $data = [
                "success" => true,
                "message" => "You Have Purchased This Course"
            ];

            dd($result->transaction);

        } else {

            $this->saveErrors($result);

            $data = [
                "success" => false,
                "message" => 'An error occurred with the message: '. $result->message
            ];
        }

        return $data;
    }
}
