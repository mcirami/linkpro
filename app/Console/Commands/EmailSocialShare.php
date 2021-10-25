<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\NotifyAboutSocialShare;
use Carbon\Carbon;
use Illuminate\Console\Command;

class EmailSocialShare extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'emails:EmailSocialShare';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Email users about sharing their link to social media';

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
        $fiveDays = Carbon::now()->subDays(5);
        $sixDays = Carbon::now()->subDays(6);
        $now = Carbon::now();

        $users = User::whereBetween('created_at', [$sixDays, $fiveDays])->get();

        foreach ($users as $user) {

            $created = Carbon::parse($user->created_at);
            $diff = $created->diffInDays($now);

            if ($diff === 5) {
                $page = $user->pages()->firstWhere( 'user_id', $user->id );

                $userData = ( [
                    'username' => $user->username,
                    'link'     => $page->name,
                    'siteUrl'  => \URL::to( '/' ) . "/",
                    'userID'  => $user["id"],
                ] );

                $user->notify( new NotifyAboutSocialShare( $userData ) );
            }
        }

        return 0;

    }
}
