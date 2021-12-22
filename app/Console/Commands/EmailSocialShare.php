<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\NotifyAboutSocialShare;
use Carbon\Carbon;
use Illuminate\Console\Command;
use App\Jobs\JobEmailSocialShare;

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
        $endDate = Carbon::now()->subDays(5)->endOfDay();
        $startDate = Carbon::now()->subDays(5)->startOfDay();
        $now = Carbon::now()->endOfDay();

        $users = User::whereBetween('created_at', [$startDate, $endDate])->get();

        foreach ($users as $user) {

            $created = Carbon::parse($user->created_at);
            $diff = $created->diffInDays($now);

            if ($diff === 5) {
                $page = $user->pages()->where( 'user_id', $user->id )->where('default', true)->get();

                if ($user->email_subscription) {
                    $userData = ( [
                        'username' => $user->username,
                        'link'     => $page[0]->name,
                        'userID'  => $user->id,
                    ] );

                    $details = ( [
                        "data" => $userData,
                        "userEmail" => $user->email
                    ]);

                    JobEmailSocialShare::dispatch($details);
                }
            }
        }

        return 0;

    }
}
