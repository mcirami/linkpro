<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function showCourseManager() {

        return view('courses.manager');
    }
}
