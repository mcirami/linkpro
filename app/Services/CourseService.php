<?php

namespace App\Services;

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
        }

        return $courseData;
    }

    public function getCourseOfferData($course) {

        return $course->Offer()->first();
    }

    public function saveCourseData($course, $request) {
        $keys = collect($request->all())->keys();

        $course->update([
            $keys[0] => $request[$keys[0]]
        ]);

        return $keys[0];
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
}
