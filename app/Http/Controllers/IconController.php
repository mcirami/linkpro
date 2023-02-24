<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Services\IconService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class IconController extends Controller
{

    public function getAffIcons() {

        $userID = Auth::id();

        $iconData = DB::table('offers')->leftJoin('courses', function ($join) {
            $join->on('course_id', '=', 'courses.id')->where('offers.public', '=', true)->where('offers.active', '=', true);
        })->leftJoin('landing_pages', 'offers.user_id', '=', 'landing_pages.user_id')
          ->leftJoin('users', 'offers.user_id', '=', 'users.id')
          ->select('offers.icon as path', 'courses.title as name', 'landing_pages.slug', 'users.username as creator')->get()->toArray();

        return response()->json([
            'iconData' => $iconData,
            'authUser' => $userID
        ]);
    }

    public function getIcons(IconService $iconService) {

        $icons = $iconService->getIcons();

        dd($icons);

    }
}
