<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureLinkIsCreated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $path = $request->path();
        if(Auth::user() && !str_contains($path, 'step-two')) {
            $user = Auth::user();
            if ( $user->pages()->get()->isEmpty() ) {
                return redirect( '/register/step-two' );
            }
        }

        return $next($request);
    }
}
