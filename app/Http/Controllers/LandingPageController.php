<?php

namespace App\Http\Controllers;

use App\Models\LandingPage;
use App\Models\LandingPageSection;
use App\Services\LandingPageService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class LandingPageController extends Controller
{
    public function show() {

    }

    /**
     * @return Application|RedirectResponse|Redirector
     */
    public function store() {
        $user = Auth::user();

        $landingPage = $user->landingPage()->create([]);

        return redirect('/course-manager/landing-page/' . $landingPage->id);
    }

    /**
     * @param LandingPage $landingPage
     *
     * @return Application|Factory|View|never
     */
    public function edit(LandingPage $landingPage, LandingPageService $service) {

        $user = Auth::user();

        if ($landingPage->user_id != $user["id"]) {
            return abort(404);
        }

        $landingPageData = $service->getLPData($landingPage);

        Javascript::put([
            'landingPage' => $landingPageData,
        ]);

        return view('landing-page.edit');
    }

    /**
     * @param Request $request
     * @param LandingPage $landingPage
     * @param LandingPageService $service
     *
     * @return JsonResponse|never
     */
    public function saveImage(Request $request, LandingPage $landingPage, LandingPageService $service) {

        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }
        $keys = collect($request->all())->keys();

        $imagePath = $service->savePageImage($userID, $request, $keys[0], $landingPage);

        return response()->json(['message' => $keys[0] . ' Updated', 'imagePath' => $imagePath]);
    }

    /**
     * @param Request $request
     * @param LandingPage $landingPage
     * @param LandingPageService $service
     *
     * @return JsonResponse|never
     */
    public function saveLandingPageData(Request $request, LandingPage $landingPage, LandingPageService $service) {

        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }

        $key = $service->savePageData($landingPage, $request);

        return response()->json(['message' => $key .  " Updated"]);
    }

    /**
     * @param Request $request
     * @param LandingPage $landingPage
     * @param LandingPageService $service
     *
     * @return JsonResponse|never
     */
    public function addSection(Request $request, LandingPage $landingPage, LandingPageService $service) {
        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }

        $section = $service->addLPSection($landingPage, $userID, $request);

        return response()->json(['section' => $section]);
    }

    public function updateSectionData(Request $request, LandingPageSection $landingPageSection, LandingPageService $service) {
        $userID = Auth::id();

        if ($landingPageSection->user_id != $userID) {
            return abort(404);
        }

        $key = $service->saveLPSection($landingPageSection, $request);

        return response()->json(['message' => $key .  " Updated"]);

    }

    public function updateSectionImage(Request $request, LandingPageSection $landingPageSection, LandingPageService $service) {
        $userID = Auth::id();

        if ($landingPageSection->user_id != $userID) {
            return abort(404);
        }

        $keys = collect($request->all())->keys();

        $imagePath = $service->saveSectionImage($userID, $request, $keys[0], $landingPageSection);

        return response()->json(['message' => $keys[0] . ' Updated', 'imagePath' => $imagePath]);

    }
}
