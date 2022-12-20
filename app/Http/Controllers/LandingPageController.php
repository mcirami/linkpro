<?php

namespace App\Http\Controllers;

use App\Models\LandingPage;
use App\Services\LandingPageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class LandingPageController extends Controller
{
    public function show() {

    }

    public function store() {
        $user = Auth::user();

        $landingPage = $user->landingPages()->create([]);

        return redirect('/course-manager/landing-page/' . $landingPage->id);
    }

    public function edit(LandingPage $landingPage) {

        $user = Auth::user();

        if ($landingPage->user_id != $user["id"]) {
            return abort(404);
        }

        Javascript::put([
            'landingPage' => $landingPage->attributesToArray()
        ]);
        return view('landing-page.edit');
    }

    public function saveImage(Request $request, LandingPage $landingPage, LandingPageService $service) {

        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }
        $keys = collect($request->all())->keys();

        $imagePath = $service->savePageImage($userID, $request, $keys[0], $landingPage);

        return response()->json(['message' => $keys[0] . ' Updated', 'imagePath' => $imagePath]);
    }

    public function saveText(Request $request, LandingPage $landingPage, LandingPageService $service) {

        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }

        $key = $service->savePageText($landingPage, $request);

        return response()->json(['message' => $key .  " Updated"]);
    }

    public function saveColor(Request $request, LandingPage $landingPage, LandingPageService $service) {
        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }

        $key = $service->savePageText($landingPage, $request);

        return response()->json(['message' => $key .  " Updated"]);
    }
}
