<?php

namespace App\Services;

use App\Models\Course;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class CourseService {

    public function getCourses($user) {

        return $user->Courses()->get()->toArray();
    }

    public function getCourseData($course) {
        $courseData = $course->attributesToArray();
        $sections = $course->CourseSections()->get()->toArray();

        $sectionArray = [];
        if (!empty($sections)) {
            foreach ( $sections as $index => $section ) {
                $object = [
                    "name" => $section["type"] . "_" . $index + 1,
                ];
                $merged = array_merge( $section, $object );
                array_push( $sectionArray, $merged );
            }

            $courseData["sections"] = $sectionArray;
        } else {
            $courseData["sections"] = [];
        }

        return $courseData;
    }

    public function getCourseOfferData($course) {

        return $course->Offer()->first();
    }

    public function saveCourseData($course, $request) {
        $keys = collect($request->all())->keys();
        $slug = null;

        $course->update([
            $keys[0] => $request[$keys[0]]
        ]);

        if ($keys[0] == "title") {
            $username = $course->user()->pluck('username')->first();
            $slug = Str::slug($request[$keys[0]], '-');
            $purchaseURL = $request->getScheme() . "://" . $request->getHost() . "/" . $username . "/" . $slug . "/" . "checkout";
            $course->update([
                'slug' => $slug,
                'purchase_link' => $purchaseURL
            ]);
        }

        return [
            "key" => $keys[0],
            "slug" => $slug
        ];
    }

    public function addCourseSection($course, $userID, $request) {
        return $course->CourseSections()->create([
           'user_id' => $userID,
           'type' => $request->type,
           'text' => null,
           'video_title' => null,
           'video_link' => null,
        ]);
    }

    public function saveSectionData($section, $request) {
        $keys = collect($request->all())->keys();

        $section->update([
            $keys[0] => $request[$keys[0]]
        ]);

        return $keys[0];
    }

    public function getPurchasedCreatorCourses($user, $authUserID) {
        return Course::where('user_id', $user->id)->whereHas('purchases', function (Builder $query) use($authUserID) {
            $query->where('user_id', 'like', $authUserID);
        })->get();
    }

    public function getUnpurchasedCreatorCourses($user, $authUserID) {
        return Course::where('user_id', $user->id)->whereDoesntHave('purchases',
            function (Builder $query)  use($authUserID) {
            $query->where('user_id', 'like', $authUserID);
        })->whereHas('offer', function($query) {
            $query->where('active', true)->where('public', true);
        })->get();
    }

    public function getUserPurchasedCourses($userID) {
        return Course::whereHas('purchases', function (Builder $query) use($userID) {
            $query->where('user_id', 'like', $userID);
        })->leftJoin('users', 'users.id', '=', 'courses.user_id')
          ->select('courses.*', 'users.username')->get();
    }

    public function getUserUnpurchasedCourses($userID) {
        return Course::whereDoesntHave('purchases', function (Builder $query) use($userID) {
            $query->where('user_id', 'like', $userID);
        })->whereHas('offer', function($query) {
            $query->where('active', true)->where('public', true);
        })->leftJoin('landing_pages', 'landing_pages.user_id', '=', 'courses.user_id')
          ->leftJoin('users', 'users.id', '=', 'courses.user_id')
          ->select('courses.*', 'landing_pages.slug as lp_slug', 'users.username')->get();
    }
}
