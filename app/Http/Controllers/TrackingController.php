<?php

namespace App\Http\Controllers;

use App\Models\Link;
use Illuminate\Http\Request;

class TrackingController extends Controller
{
    public function storeLinkVisit(Link $link) {

        $link->linkVisits()->create();

        return response()->json(['message' => "Success!"]);
    }
}
