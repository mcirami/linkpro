<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class LandingPageController extends Controller
{
    public function show() {

    }

    public function edit() {

        Javascript::put([]);
        return view('landing-page.edit');
    }
}
