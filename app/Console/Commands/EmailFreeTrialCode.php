<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\NotifyAboutFreeTrial;
use Carbon\Carbon;
use Illuminate\Console\Command;

class EmailFreeTrialCode extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'emails:EmailFreeTrial';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Email users a free trial promo code if they that have not upgraded after 7 days';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $sevenDays = Carbon::now()->subDays(7);
        $eightDays = Carbon::now()->subDays(8);
        $now = Carbon::now();
        $users = User::whereBetween('created_at', [$eightDays, $sevenDays])->get();

        foreach ($users as $user) {

            $created = Carbon::parse($user->created_at);
            $diff = $created->diffInDays($now);

            if ($diff === 7 && empty($user->subscriptions->get()) ) {
                //$page = $user->pages()->firstWhere( 'user_id', $user->id );

                $userData = ( [
                    'username' => $user->username,
                    //'link'     => $page->name,
                    'siteUrl'  => \URL::to( '/' ) . "/",
                ] );

                $user->notify( new NotifyAboutFreeTrial( $userData ) );
            }
        }

        return 0;
    }
}
