<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\User;
use App\Services\CourseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class CourseController extends Controller
{
    public function showCourseManager() {

        $user = Auth::user();

        $landingPage = $user->LandingPage()->get()->toArray();
        //$courses = $user->Courses()->where('landing_page_id', $landingPage[0]["id"])->get()->toArray();
        //$offers = $user->Offers()->where('course_id',$courses[0]["id"])->first()->toArray();

        $offers = DB::table('courses')->leftJoin('offers', 'courses.id', '=', 'courses.id')->get()->toArray();

        return view('courses.manager')->with([
            'landingPage' => $landingPage,
            'offers' => $offers
        ]);
    }

    public function edit(Course $course, CourseService $courseService) {

        $user = Auth::user();

        if ($course->user_id != $user["id"]) {
            return abort(404);
        }

        $courseData = $courseService->getCourseData($course);
        $landingPageLogo = $user->LandingPage()->pluck('logo');
        $offerData = $courseService->getCourseOfferData($course);

        Javascript::put([
            'course' => $courseData,
            'LPLogo' => $landingPageLogo[0],
            'offerData' => $offerData
        ]);

        return view('courses.edit');

    }

    public function store() {
        $user = Auth::user();

        $landingPageID = $user->LandingPage()->pluck('id')->first();
        $course = $user->Courses()->create([
            'landing_page_id' => $landingPageID
        ]);

        $user->Offer()->create([
            'course_id' => $course->id,
        ]);

        return redirect('/course-manager/course/' . $course->id);

    }

    public function saveCourseData(Request $request, Course $course, CourseService $courseService) {
        $userID = Auth::id();

        if ($course->user_id != $userID) {
            return abort(404);
        }

        $key = $courseService->saveCourseData($course, $request);

        return response()->json(['message' => $key .  " Updated"]);
    }

    public function saveImage() {

    }

    public function addSection(Request $request, Course $course, CourseService $service) {
        $userID = Auth::id();

        if ($course->user_id != $userID) {
            return abort(404);
        }

        $section = $service->addCourseSection($course, $userID, $request);

        return response()->json(['section' => $section]);
    }

    public function updateSectionData(Request $request, CourseSection $courseSection, CourseService $service) {
        $userID = Auth::id();

        if ($courseSection->user_id != $userID) {
            return abort(404);
        }

        $key = $service->saveSectionData($courseSection, $request);

        return response()->json(['message' => $key .  " Updated"]);
    }

    public function updateSectionImage() {

    }

    public function deleteSection(CourseSection $courseSection) {
        $userID = Auth::id();

        if ($courseSection->user_id != $userID) {
            return abort(404);
        }

        $courseSection->delete();

        return response()->json(['message' => "Section Deleted"]);
    }
}
