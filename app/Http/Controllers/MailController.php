<?php

namespace App\Http\Controllers;
use App\Mail\WelcomeMail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class MailController extends Controller
{
    public function sendEmail() {

        //Mail::to('mcirami@gmail.com')->send(new WelcomeMail());

        return (new MailMessage)
            ->subject('Welcome To Link Pro!')
            ->markdown('emails.resume', ['data' => ['username' => 'mcirami', 'link' => 'mcirmai5', 'siteUrl' => 'http://0.0.0.0', 'plan' => 'Premier', 'end_date' => "September 12, 2021", 'userID' => 5] ]);
        //return new WelcomeMail();
    }
}
