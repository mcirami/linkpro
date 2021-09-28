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
            ->markdown('emails.share', ['data' => ['username' => 'mcirami', 'link' => 'mcirmai', 'siteUrl' => 'http://0.0.0.0/'] ]);
        //return new WelcomeMail();
    }
}
