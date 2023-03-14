<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\User;
use App\Services\CourseService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;
use App\Http\Traits\PermissionTrait;

class CourseController extends Controller
{
    use PermissionTrait;

    public function show(User $user, Course $course) {

        $offer = $course->Offer()->first();

        if (!$offer->published) {
            return abort(404);
        }

        $hasCourseAccess = $this->checkCoursePermission($course);

        $landingPageData = $user->LandingPages()->first();
        $sections        = $course->CourseSections()->get();

        Javascript::put( [
            'course'          => $course,
            'sections'        => $sections,
            'landingPageData' => $landingPageData,
            'creator'         => $user->username,
            'hasCourseAccess'    => $hasCourseAccess
        ] );

        return view( 'courses.show' )->with( [ 'landingPageData' => $landingPageData ] );
    }

    public function showCourseManager() {

        $user = Auth::user();

        $landingPage = $user->LandingPages()->first();

        $offers = DB::table('courses')->join('offers', function ($join) use($user){
            $join->on('course_id', '=', 'courses.id')->where('offers.user_id', '=', $user->id);
        })->get()->toArray();

        Javascript::put([]);
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
        $landingPageData = $user->LandingPages()->select('logo','header_color')->get();
        $offerData = $courseService->getCourseOfferData($course);

        Javascript::put([
            'course' => $courseData,
            'LPData' => $landingPageData[0],
            'offerData' => $offerData,
            'username' => $user["username"]
        ]);

        return view('courses.edit');

    }

    public function store() {
        $user = Auth::user();

        $landingPageID = $user->LandingPages()->pluck('id')->first();
        $course = $user->Courses()->create([
            'landing_page_id' => $landingPageID
        ]);

        $user->Offers()->create([
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

        return response()->json(['message' => $key["key"] .  " Updated", 'slug' => $key["slug"]]);
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

    public function deleteSection(CourseSection $courseSection) {
        $userID = Auth::id();

        if ($courseSection->user_id != $userID) {
            return abort(404);
        }

        $courseSection->delete();

        return response()->json(['message' => "Section Deleted"]);
    }

    public function showAllCourses(User $user, CourseService $courseService) {

        $creator = $user->username;

        $authUserID = Auth::user()->id;
        $landingPageData = $user->LandingPages()->first();


        $purchasedCourses = $courseService->getPurchasedCreatorCourses($user, $authUserID);

        $unPurchasedCourses = $courseService->getUnpurchasedCreatorCourses($user, $authUserID);

        Javascript::put([
            'landingPageData'       => $landingPageData,
            'creator'               => $creator
        ]);

        return view('courses.all')->with([
            'landingPageData'       => $landingPageData,
            'purchasedCourses'      => $purchasedCourses,
            'unPurchasedCourses'    => $unPurchasedCourses,
            'creator'               => $creator
        ]);
    }

    public function showCoursesLpUser(CourseService $courseService) {

        $userID = Auth::id();

        $purchasedCourses = $courseService->getUserPurchasedCourses($userID);

        $unPurchasedCourses = $courseService->getUserUnpurchasedCourses($userID);

        Javascript::put([]);

        return view('courses.showAll')->with([
            'purchasedCourses'      => $purchasedCourses,
            'unPurchasedCourses'    => $unPurchasedCourses,
        ]);
    }
}
