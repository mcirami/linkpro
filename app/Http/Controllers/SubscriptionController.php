<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function show() {

        return view('subscription.index', ['intent' => auth()->user()->createSetupIntent(),]);
    }

    public function store(Request $request) {

        //dd($request->all());

        $request->user()->newSubscription(
            $request->level , $request->plan
        )->create($request->paymentMethod);

        return redirect('/');

    }
}
