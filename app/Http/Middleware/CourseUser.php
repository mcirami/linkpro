<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            session()->put('url.intended', $request->url());
            $username = $request->route('user')->username;
            return redirect('/' .$username . '/course/login');
        }

        if (Auth::user()->role_id == 2) {
            return redirect()->route('/');
        }

        if (Auth::user()->role_id == 3) {
            return $next($request);
        }
    }
}
