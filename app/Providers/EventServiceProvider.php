<?php

namespace App\Providers;

use App\Listeners\UpdateTransactionStatus;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use SocialiteProviders\Manager\SocialiteWasCalled;
use SocialiteProviders\MailChimp\MailChimpExtendSocialite;
use SocialiteProviders\Shopify\ShopifyExtendSocialite;
use Illuminate\Support\Facades\Event;
use App\Events\PurchasedItem;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        SocialiteWasCalled::class => [
            ShopifyExtendSocialite::class.'@handle',
            MailChimpExtendSocialite::class.'@handle',
        ],
        PurchasedItem::class => [
            UpdateTransactionStatus::class, '@handle',
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
