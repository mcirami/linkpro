<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AffiliateStatsController extends Controller
{
    public function show() {

        return view('stats.admin.affiliate-stats');
    }
}
