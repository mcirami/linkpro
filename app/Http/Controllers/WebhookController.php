<?php

namespace App\Http\Controllers;

use App\Models\Referral;
use App\Models\Subscription;
use App\Services\WebhookService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Http\Traits\SubscriptionTrait;

class WebhookController extends Controller
{

    use SubscriptionTrait;

    public function subscriptionExpired(WebhookService $webhookService) {

        $gateway = $this->createGateway();

        /**for testing **/
        //$webhookService->webhookTest($gateway);

        if (
            isset($_POST["bt_signature"]) &&
            isset($_POST["bt_payload"])
        ) {
            $notification = $gateway->webhookNotification()->parse(
                $_POST["bt_signature"],
                $_POST["bt_payload"]
            );

            $webhookService->expired($notification);

        }
    }

    public function chargedSuccessfully(WebhookService $webhookService) {

        $gateway = $this->createGateway();

        /**for testing **/
        //$webhookService->webhookTest($gateway);

        if (
            isset($_POST["bt_signature"]) &&
            isset($_POST["bt_payload"])
        ) {
            $notification = $gateway->webhookNotification()->parse(
                $_POST["bt_signature"],
                $_POST["bt_payload"]
            );

            $webhookService->charged($notification);
        }
    }
}
