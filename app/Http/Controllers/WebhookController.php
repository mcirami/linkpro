<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Subscription;
use App\Models\User;
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
        );*/

        if (
            isset($_POST["bt_signature"]) &&
            isset($_POST["bt_payload"])
        ) {
            $notification = $gateway->webhookNotification()->parse(
                $_POST["bt_signature"],
                $_POST["bt_payload"]
            );

            if ( $notification->kind === 'subscription_expired' ) {
                $subscription = Subscription::where('braintree_id', $notification->subscription->id )->first();
                $user         = User::findOrFail( $subscription->user_id );
                $userPages    = $user->pages()->get();

                if ( !empty( $userPages ) ) {

                    foreach ( $userPages as $userPage ) {
                        if ( $userPage->is_protected ) {
                            $userPage->is_protected = 0;
                            $userPage->password     = null;
                        }
                        if ( ! $userPage->default ) {
                            $userPage->disabled = true;
                        }

                        $userPage->save();

                        if ( $userPage->default ) {
                            $folders = Folder::where( 'page_id', $userPage->id )->get();
                            if ( ! empty( $folders ) ) {
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
            }

            Log::channel('webhooks')->info($notification->timestamp->format('D M j G:i:s T Y') . " --- " . $notification->kind . " --- " . $notification->subscription->id);

            //Log::channel( 'webhooks' )->info( $notification->subscription->id . " --- " . $notification->kind );

            header( "HTTP/1.1 200 OK" );
        }
    }
}
