<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseSection;
use App\Models\User;
use App\Services\CourseService;
use App\Services\LandingPageService;
use App\Services\OfferService;
use App\Services\TrackingServices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
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
            'course'            => $course,
            'sections'          => $sections,
            'landingPageData'   => $landingPageData,
            'creator'           => $user->username,
            'hasCourseAccess'   => $hasCourseAccess,
        ] );

        return view( 'courses.show' )->with( [ 'landingPageData' => $landingPageData ] );
    }

    public function showCourseLander(Request $request, User $user, Course $course, TrackingServices $trackingServices) {

        $offer = $course->Offer()->first();

        if (!$offer->published) {
            return abort(404);
        }

        $responseData = $trackingServices->storeOfferClick($offer, $request, $user);

        $hasCourseAccess = $this->checkCoursePermission($course);

        $landingPageData = $user->LandingPages()->first();
        $sections        = $course->CourseSections()->get();

        Javascript::put( [
            'course'            => $course,
            'sections'          => $sections,
            'landingPageData'   => $landingPageData,
            'creator'           => $user->username,
            'hasCourseAccess'   => $hasCourseAccess,
            'affRef'            => $responseData['affRef'],
            'clickId'           => $responseData['clickId']
        ] );

        return view( 'courses.show' )->with( [ 'landingPageData' => $landingPageData ] );
    }

    public function showCreatorCenter(OfferService $offerService, LandingPageService $landingPageService) {

        $user = Auth::user();

        $landingPageData = null;
        $landingPage = $user->LandingPages()->first();
        if ($landingPage) {
            $landingPageData = $landingPageService->getLPData($landingPage);
        }

        $offers = $offerService->getOffers($user);

        Javascript::put([
            'offers'        => $offers,
            'landingPage'   => $landingPageData
        ]);
        return view('courses.creator');
    }

    public function edit(Course $course, CourseService $courseService) {
        $user = Auth::user();

        if ($course->user_id != $user["id"]) {
            return abort(404);
        }

        $courseData = $courseService->getCourseData($course);
        //$landingPageData = $user->LandingPages()->select('logo','header_color')->get();
        $offerData = $courseService->getCourseOfferData($course);
        $categories = Category::with('children')->whereNull('parent_id')->get();

        Javascript::put([
            'course'        => $courseData,
            //'LPData'        => $landingPageData[0],
            'offerData'     => $offerData,
            'username'      => $user["username"],
            'categories'    => $categories
        ]);

        return view('courses.edit');

    }

    public function store() {
        $user = Auth::user();

        $course = $user->Courses()->create();

        $user->Offers()->create([
            'course_id' => $course->id,
        ]);

        return redirect('/creator-center/course/' . $course->id);

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

    public function getCourseCategories() {

        $categories = Category::with('children')->whereNull('parent_id')->get();

        return response()->json(['categories' => $categories]);
    }
}
