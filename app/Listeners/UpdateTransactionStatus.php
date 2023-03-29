<?php

namespace App\Listeners;

use App\Events\PurchasedItem;
use App\Models\Purchase;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Http\Traits\SubscriptionTrait;
use Illuminate\Support\Facades\Log;

class UpdateTransactionStatus implements ShouldQueue
{

    use SubscriptionTrait;

    /**
     * The time (seconds) before the job should be processed.
     *
     * @var int
     */
    public $delay = 900;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\PurchasedItem  $event
     * @return void
     */
    public function handle(PurchasedItem $event)
    {
        $transactionId = $event->purchase->transaction_id;
        $gateway = $this->createGateway();
        $result = $gateway->transaction()->search([\Braintree\TransactionSearch::id()->is($transactionId)]);

        if ($result->success) {

            $purchase = Purchase::where('transaction_id', $transactionId)->first();
            $purchase->update([
                'status' =>  $result->transaction->status
            ]);

        } else {
            Log::channel( 'cloudwatch' )->info( "--transaction id--" .
                                                $transactionId .
                                                "--error getting transaction status in Event Listener--" .
                                                $result->message
            );
        }
    }
}
