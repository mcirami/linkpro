<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Auth\CourseRegisterController;
use App\Models\Course;
use App\Models\Offer;
use App\Models\User;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use App\Http\Traits\SubscriptionTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;


class PurchaseController extends Controller
{
    use SubscriptionTrait;

    public function show(User $user, Course $course, PurchaseService $purchaseService) {

        Session::put('creator', $user->username);
        $token = $purchaseService->getToken();
        $offer = $course->Offer()->first();
        $landingPageData = $user->LandingPages()->first();

        Javascript::put([
            'landingPageData' => $landingPageData
        ]);

        return view('purchase.show')->with([
            'token' => $token,
            'offer' => $offer,
            'courseTitle' => $course->title,
            'landingPageData' => $landingPageData,
            'creator' => $user->username
        ]);
    }

    public function store(Request $request, PurchaseService $purchaseService) {

        $offer = Offer::findOrFail($request->offer);

        $data = $purchaseService->purchase($offer, $request);

        if ($data["success"]) {
            $username = $offer->user()->pluck('username')->first();
            $courseSlug = $data["course_slug"];

            return redirect('/' . $username . "/course/" . $courseSlug)->with( ['success' => $data["message"]] );
        } else {
            return back()->withErrors($data["message"]);
        }

    }
}
