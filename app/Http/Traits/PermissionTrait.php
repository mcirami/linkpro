<?php

namespace App\Http\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

trait PermissionTrait {

    public function checkPermissions() {

        if (!Session::has('permissions')) {
            $user = Auth::user();
            $permissions = $user->getPermissionsViaRoles()->pluck('name');
            Session::put('permissions', $permissions);
        }

    }

    public function checkCoursePermission($course) {

        $user = Auth::user();

        $coursePurchased = $user->Purchases()->where('course_id', $course->id)->first();
        if ($coursePurchased || $user->id == $course->user_id) {
            return true;
        } else {
            return false;
        }

    }

    public function setCreatorSession($creator) {

        if (!Session::has('creator')) {
            Session::put('creator', $creator);
        }

    }
}
