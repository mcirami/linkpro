<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Http\Traits\SubscriptionTrait;


class WebhookController extends Controller
{

    use SubscriptionTrait;

    public function subscriptionExpired() {

        $gateway = $this->createGateway();

        /* FOR TESTING */
        /*$notification = $gateway->webhookTesting()->sampleNotification(
            WebhookNotification::SUBSCRIPTION_CANCELED,
            'my_id'
        );*/

        /*$webhookNotification = $gateway->webhookNotification()->parse(
            $notification['bt_signature'],
            $notification['bt_payload']
        );*/

        $notification = $gateway->webhookNotification()->parse(
            $_POST["bt_signature"],
            $_POST["bt_payload"]
        );

        if ($notification->kind === 'subscription_expired') {
            $subscription = Subscription::findOrFail($notification->subscription->id);
            $user = User::findOrFail($subscription->user_id);
            $userPages = $user->pages()->get();

            if (!empty($userPages)) {

                foreach ( $userPages as $userPage ) {
                    if ( $userPage->is_protected ) {
                        $userPage->is_protected = 0;
                        $userPage->password = null;
                    }
                    if (!$userPage->default) {
                        $userPage->disabled = true;
                    }

                    $userPage->save();

                    if($userPage->default) {
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

            $subscription->update(['name', 'free']);
        }

        Log::channel('webhooks')->info($notification->timestamp->format('D M j G:i:s T Y') . " --- " . $notification->kind . " --- " . $notification->subscription->id);

        //Log::channel('webhooks')->info($webhookNotification->subscription->id . " --- " . $webhookNotification->kind);

        header("HTTP/1.1 200 OK");
    }
}
