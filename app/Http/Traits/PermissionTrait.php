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
}
