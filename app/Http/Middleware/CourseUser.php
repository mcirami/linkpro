<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use App\Http\Traits\PermissionTrait;

class CourseUser
{

    use PermissionTrait;

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $username = $request->route('user')->username;
        if (!Auth::check()) {
            session()->put('url.intended', $request->url());
            return redirect('/' . $username . '/course/login');
        }

        $user = Auth::user();
        $this->checkPermissions();

        if ($user->hasAnyRole(['admin', 'course.user'])) {
            $this->setCreatorSession($username);
            return $next($request);
        }

        if ($user->hasRole('lp.user')) {
            return redirect()->route('dashboard');
        }
    }

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {

            $previousURL = Session::get('url.intended');
            if ($previousURL) {
                return Redirect::intended();
            } else {
                return route('login');
            }
        }
    }
}
