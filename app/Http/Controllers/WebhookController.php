<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Referral;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Http\Traits\SubscriptionTrait;
use Braintree\WebhookNotification;

class WebhookController extends Controller
{

    use SubscriptionTrait;

    public function subscriptionExpired() {

        $gateway = $this->createGateway();

        /* FOR TESTING */

        /*$sampleNotification = $gateway->webhookTesting()->sampleNotification(
            WebhookNotification::SUBSCRIPTION_EXPIRED,
            'my_id'
        );


        $notification = $gateway->webhookNotification()->parse(
            $sampleNotification['bt_signature'],
            $sampleNotification['bt_payload']
        );

        if ( $notification->kind == 'subscription_expired' ) {
            Log::channel( 'webhooks' )->info( Carbon::now() .
                                              " --- bt_signature --- " .
                                              $sampleNotification['bt_signature'] .
                                              " --- bt_payload --- " .
                                              $sampleNotification['bt_payload'] .
                                              "--- kind --- " .
                                              $notification->kind
            );
        }*/
        /******/

        Log::channel('webhooks')->info(Carbon::now() . " --- bt_signature --- ". $_POST["bt_signature"] ." --- bt_payload --- " . $_POST["bt_payload"]);

        if (
            isset($_POST["bt_signature"]) &&
            isset($_POST["bt_payload"])
        ) {
            $notification = $gateway->webhookNotification()->parse(
                $_POST["bt_signature"],
                $_POST["bt_payload"]
            );

            Log::channel('webhooks')->info($notification->timestamp->format('D M j G:i:s T Y') .  "--- Before IF statement --- Kind: " . $notification->kind . " --- Sub ID:" . $notification->subscription->id);

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

                $subscription->update( [ 'name', 'free' ] );

                Log::channel('webhooks')->info($notification->timestamp->format('D M j G:i:s T Y') . "--- Inside IF statement --- " . $notification->kind . " --- " . $notification->subscription->id);

            }


            //Log::channel( 'webhooks' )->info( $notification->subscription->id . " --- " . $notification->kind );

            header( "HTTP/1.1 200 OK" );
        }
    }

    public function chargedSuccessfully() {

        $gateway = $this->createGateway();

        /* FOR TESTING */
        $sampleNotification = $gateway->webhookTesting()->sampleNotification(
            WebhookNotification::SUBSCRIPTION_CHARGED_SUCCESSFULLY,
            'kgztvm'
        );

        $notification = $gateway->webhookNotification()->parse(
            $sampleNotification['bt_signature'],
            $sampleNotification['bt_payload']
        );

        if ( $notification->kind == 'subscription_charged_successfully' ) {

            $subId = $notification->subscription->id;
            $planId = 'pro';

            $subscription = Subscription::where('braintree_id', $subId )->first();
            $referral = Referral::where('referral_id', $subscription->user_id)->first();
            //$recurringCount = $referral->reccuring_count + 1;

            if ($referral != null) {
                $created = Carbon::parse($referral->created_at->startOfDay());
                //$startDate = Carbon::now()->startOfDay();
                $today = Carbon::now();
                $diff = $created->diffInDays( $today );

                if ($diff > 0) {
                    Referral::create([
                        'referral_id' => $referral->referral_id,
                        'user_id' => $referral->user_id,
                        'subscription_id' => $subscription->id,
                        'plan_id' => $planId
                    ]);
                }
            }

            Log::channel( 'webhooks' )->info( Carbon::now() .
                                              " --- bt_signature --- " .
                                              $sampleNotification['bt_signature'] .
                                              " --- bt_payload --- " .
                                              $sampleNotification['bt_payload'] .
                                              "--- kind --- " .
                                              $notification->kind .
                                              "--- notificaton ---" .
                                              "--- plan id ---" .
                                              $subId
            );
        }
        /******/

        /*if (
            isset($_POST["bt_signature"]) &&
            isset($_POST["bt_payload"])
        ) {
            $notification = $gateway->webhookNotification()->parse(
                $_POST["bt_signature"],
                $_POST["bt_payload"]
            );

            Log::channel('webhooks')->info($notification->timestamp->format('D M j G:i:s T Y') .  "--- Before IF statement --- Kind: " . $notification->kind . " --- Sub ID:" . $notification->subscription->id);

            if ( $notification->kind == 'subscription_charged_successfully' ) {

                $subId = $notification->subscription->id;
                $planId = $notification->subscription->planId;

            }
        }*/
    }
}
