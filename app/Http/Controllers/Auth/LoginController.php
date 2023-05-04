<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\URL;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    //protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

        //Session::put('previous_url', ($this->redirectPath()));
        $this->middleware('guest')->except('logout');
    }

    /**
     * Get the login username to be used by the controller.
     *
     * @return string
     */
    public function username()
    {
        $login = request()->input('identity');

        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        request()->merge([$field => $login]);

        return $field;
    }

    public function courseLogin(User $user) {

        $landingPageData = $user->LandingPages()->first();

        return view('auth.course-login', ['url' => 'course'])->with(['landingPageData' => $landingPageData, 'username' => $user->username]);
    }


    /**
     * Validate the user login request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function validateLogin(Request $request)
    {
        $messages = [
            'identity.required' => 'Email or username cannot be empty',
            'email.exists' => 'Email or username already registered',
            'username.exists' => 'Username is already registered',
            'password.required' => 'Password cannot be empty',
        ];

        $request->validate([
            'identity' => 'required|string',
            'password' => 'required|string',
            'email' => 'string|exists:users',
            'username' => 'string|exists:users',
        ], $messages);
    }

    public function customRedirect() {
        $user = Auth::user();
        $page = $user->pages()->first()->pluck('id');
        return $page;
    }

    protected function authenticated(Request $request, $user) {

        $loginURL = url()->previous();
        $roles = $user->getRoleNames();
        $permissions = $user->getPermissionsViaRoles()->pluck('name');
        $creator = isset($_GET['creator']) ? $_GET['creator'] : "";

        Session::put('permissions', $permissions);
        /*foreach ($permissions as $permission) {
            Session::push('permissions', $permission);
        }*/

        if ($roles->contains('admin')) {

            $previousURL = Session::get( 'url.intended' );

            if ( $previousURL ) {
                return Redirect::intended();
            } else {
                if (str_contains($loginURL, "course")) {
                    Session::put('creator', $creator);
                    return redirect('/' . $creator . '/courses');
                } else if (str_contains($loginURL, "admin")) {
                    return redirect( '/admin' );
                } else {
                    return redirect( '/dashboard' );
                }
            }

        } else if ($roles->contains("course.user") && $roles->contains('lp.user')) {

            if (str_contains($loginURL, "course")) {
                Session::put('creator', $creator);
                return redirect('/' . $creator . '/courses');
            } else {
                $userPages = $user->pages()->get();

                if ( $userPages->isEmpty() ) {
                    return redirect()->route( 'create.page' );
                } else {
                    $previousURL = Session::get( 'url.intended' );
                    if ( $previousURL ) {
                        return Redirect::intended();
                    } else {
                        return redirect( '/dashboard' );
                    }
                }
            }

        } else if ($roles->contains('lp.user')) {

            $userPages = $user->pages()->get();

            if ( $userPages->isEmpty() ) {
                return redirect()->route( 'create.page' );
            } else {
                $previousURL = Session::get( 'url.intended' );
                if ( $previousURL ) {
                    return Redirect::intended();
                } else {
                    return redirect( '/dashboard' );
                }
            }

        } else if ($roles->contains("course.user")) {

            $previousURL = Session::get('url.intended');
            if ($previousURL) {
                return Redirect::intended();
            } else {
                Session::put('creator', $creator);
                return redirect('/' . $creator . '/courses');
            }

        }
    }
}
