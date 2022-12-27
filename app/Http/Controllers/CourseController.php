<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function showCourseManager() {

        $user = Auth::user();
        //$user = User::where('id', 24)->firstOrFail();

        $landingPage = $user->LandingPage()->get()->toArray();

        return view('courses.manager')->with(['landingPage' => $landingPage]);
    }
}
