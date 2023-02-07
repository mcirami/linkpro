<?php

namespace App\Services;

use App\Models\Purchase;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\SubscriptionTrait;

class PurchaseService {

    use SubscriptionTrait;

    public function purchase($offer, $request, $gateway) {

        $nonce = $request->payment_method_nonce;

        $user = isset($request->user) ? User::findOrFail($request->user) : Auth::user();

        $email = $user->email;

        $customer = $gateway->customer()->create( [
            'email'              => $email,
            'paymentMethodNonce' => $nonce
        ] );

        if ( $customer->success ) {

            $result = $gateway->transaction()->sale([
                'amount' => $offer->price,
                'paymentMethodToken' => $customer->customer->paymentMethods[0]->token,
                'options' => [
                    'submitForSettlement' => True
                ]
            ]);

            if ($result->success) {

                $course = $offer->Course()->first();
                $paymentMethod = strtolower( get_class( $customer->customer->paymentMethods[0] ) );

                if (str_contains($paymentMethod, "credit") ) {
                    //$paymentMethod = $customer->customer->paymentMethods[0]->cardType;
                    $last4 = $customer->customer->paymentMethods[0]->last4;
                } else {
                    $last4 = null;
                }

                $course->Purchases()->create([
                    'user_id'           => $user->id,
                    'customer_id'       => $customer->customer->id,
                    'transaction_id'    => $result->transaction->id,
                    'purchase_amount'   => $offer->price,
                    'pm_last_four'      => $last4,
                    'pm_type'           => $paymentMethod,
                    'status'            => $result->transaction->status
                ]);

                $data = [
                    "success" => true,
                    "message" => "You Have Purchased This Course",
                    "course_slug" => $course->slug,
                ];

            } else {

                $this->saveErrors($result);

                $data = [
                    "success" => false,
                    "message" => 'An error occurred with the message: '. $result->message
                ];
            }
        } else {
            $this->saveErrors($customer);

            $data = [
                "success" => false,
                "message" => 'An error occurred with the message: ' . $customer->message
            ];
        }


        return $data;
    }
}
