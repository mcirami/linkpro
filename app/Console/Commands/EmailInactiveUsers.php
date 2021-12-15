<?php

namespace App\Console\Commands;
use App\Models\User;
use App\Notifications\NotifyInactiveUser;
use Carbon\Carbon;
use Illuminate\Console\Command;

class EmailInactiveUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'emails:EmailInactiveUsers';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Email inactive users';

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
        $min = Carbon::now()->subDays(3);
        $max = Carbon::now()->subDays(30);
        $users = User::whereBetween('created_at', [$max, $min])->get();
        $now = Carbon::now();

        foreach ($users as $user) {
            $userLinks = $user->links()->get();
            $count = $userLinks->count();
            $created = Carbon::parse($user->created_at);
            $diff = $created->diffInDays($now);

            if ($count === 1 && ($diff === 3 || $diff === 7 || $diff === 30)) {
                $page = $user->pages()->where( 'user_id', $user->id )->where('default', true)->get();

                $userData = ([
                    'username' => $user->username,
                    'link' => $page[0]->name,
                    'userID'  => $user->id,
                ]);

                if ($user->email_subscription) {
                    $user->notify( new NotifyInactiveUser( $userData ) );
                }
            }
        }

        return 0;

    }
}
