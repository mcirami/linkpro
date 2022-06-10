<?php

namespace App\Services;

use App\Models\Folder;
use App\Models\Referral;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Braintree\WebhookNotification;

class WebhookService {

    /**
     * @param $notification
     *
     * @return void
     */
    public function expired($notification) {

        if ( $notification->kind == 'subscription_expired' ) {
            $subscription = Subscription::where('braintree_id', $notification->subscription->id )->first();
            $user         = User::findOrFail( $subscription->user_id );
            $userPages    = $user->pages()->get();

            if ( !empty( $userPages ) ) {

                foreach ( $userPages as $userPage ) {
                    if ( $userPage->is_protected ) {
                        $userPage->is_protected = 0;
                        $userPage->password     = null;
                    }
                    if ( !$userPage->default ) {
                        $userPage->disabled = true;
                    }

                    $userPage->save();

                    if ( $userPage->default ) {
                        $folders = Folder::where( 'page_id', $userPage->id )->get();
                        if ( !empty( $folders ) ) {
                            foreach ( $folders as $folder ) {
                                if ( $folder->active_status ) {
                                    $folder->active_status = 0;
                                    $folder->save();
                                }
                            }
                        }
                    }
                }
            }

            $subscription->update( [ 'name' => 'free' ] );

            Log::channel('webhooks')->info($notification->timestamp->format('D M j G:i:s T Y') . $notification->kind . " --- " . $notification->subscription->id);

            header( "HTTP/1.1 200 OK" );
        }
    }

    /**
     * @param $notification
     *
     * @return void
     */
    public function charged($notification) {

        if ( $notification->kind == 'subscription_charged_successfully' ) {

            $subId = $notification->subscription->id;
            $planId = $notification->subscription->planId;

            $subscription = Subscription::where('braintree_id', $subId )->first();
            $referral = Referral::where('referral_id', $subscription->user_id)->orderBy('updated_at', 'DESC')->first();

            if ($referral != null) {

                if ($referral->plan_id == null) {

                    $referral->update([
                        'subscription_id' => $subscription->id,
                        'plan_id' => $planId
                    ]);

                } else {

                    if ($referral->plan_id == $planId) {

                        Referral::create([
                            'referral_id' => $referral->referral_id,
                            'user_id' => $referral->user_id,
                            'subscription_id' => $subscription->id,
                            'plan_id' => $planId
                        ]);

                    } else {

                        $referral->update([
                            'plan_id' => $planId
                        ]);

                    }
                }
            }

            Log::channel( 'webhooks' )->info( $notification->timestamp->format('D M j G:i:s T Y') .
                                              " --- kind --- " .
                                              $notification->kind .
                                              " --- plan id --- " .
                                              $planId .
                                              " --- sub id --- " .
                                              $subId
            );

            header( "HTTP/1.1 200 OK" );
        }
    }

    /**
     * @param $gateway
     *
     * @return void
     */
    public function webhookTest($gateway, $type) {

        if ($type == 'SUBSCRIPTION_CHARGED_SUCCESSFULLY') {
            $sampleNotification = $gateway->webhookTesting()->sampleNotification(
                WebhookNotification::SUBSCRIPTION_CHARGED_SUCCESSFULLY,
                    'kgztvm'
                );
        } else if ($type == 'SUBSCRIPTION_EXPIRED') {
            $sampleNotification = $gateway->webhookTesting()->sampleNotification(
                WebhookNotification::SUBSCRIPTION_EXPIRED,
                'kgztvm'
            );
        }


        $notification = $gateway->webhookNotification()->parse(
            $sampleNotification['bt_signature'],
            $sampleNotification['bt_payload']
        );

        /*Log::channel( 'webhooks' )->info( $notification->timestamp->format('D M j G:i:s T Y') .
                                          " --- kind --- " .
                                          $notification->kind
        );*/
        Log::channel( 'cloudwatch' )->info( $notification->timestamp->format('D M j G:i:s T Y') .
                                          " --- kind --- " .
                                          $notification->kind
        );

    }
}
