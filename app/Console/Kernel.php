<?php

namespace App\Console;

use App\Console\Commands\EmailInactiveUsers;
use App\Console\Commands\EmailSocialShare;
use App\Console\Commands\EmailFreeTrialCode;
use App\Console\Commands\TestAddDBRecord;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        EmailInactiveUsers::class,
        EmailSocialShare::class,
        EmailFreeTrialCode::class,
        TestAddDBRecord::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        /*$schedule->command('test:TestAddDBRecord')
                 ->timezone('America/New_York')
                 ->everyMinute()
                 ->emailOutputTo('mcirami@gmail.com');*/

        $schedule->command('emails:EmailInactiveUsers')
                 ->timezone('America/New_York')
                 ->dailyAt('7:00')
                 ->emailOutputTo('mcirami@gmail.com');

        $schedule->command('emails:EmailSocialShare')
                 ->timezone('America/New_York')
                 ->dailyAt('7:15')
                 ->emailOutputTo('mcirami@gmail.com');

        $schedule->command('emails:EmailFreeTrialCode')
                 ->timezone('America/New_York')
                 ->dailyAt('7:30')
                 ->emailOutputTo('mcirami@gmail.com');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
