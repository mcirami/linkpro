<?php

namespace App\Http\Controllers;
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class MailController extends Controller
{
    public function sendEmail() {

        Mail::to('mcirami@gmail.com')->send(new WelcomeMail());

        return new WelcomeMail();
    }
}
