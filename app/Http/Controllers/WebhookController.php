<?php

namespace App\Http\Controllers;

use App\Services\WebhookService;
use Illuminate\Support\Facades\Log;
use App\Http\Traits\SubscriptionTrait;

class WebhookController extends Controller
{

    use SubscriptionTrait;

    public function chargedSuccessfully(WebhookService $webhookService) {

        $gateway = $this->createGateway();

        /**for testing **/
        //$webhookService->webhookTest($gateway, 'SUBSCRIPTION_CHARGED_SUCCESSFULLY');

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
