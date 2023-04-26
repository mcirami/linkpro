<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\StatsServices;
use Illuminate\Http\Request;

class AffiliateStatsController extends Controller
{
    public function show() {

        return view('stats.admin.affiliate-stats');
    }

    public function getAffiliateStats(Request $request, StatsServices $statsServices) {

        $data = $statsServices->getAllAffiliateStats($request);

        return response()->json(['data' => $data]);
    }
}