<?php

namespace App\Services;
use Illuminate\Support\Facades\Storage;

class LandingPageService {

    public function savePageLogo($userID, $request) {
        $imgName = $userID . '-' . time() . '.' . $request->ext;
        $path = 'landing-pages/' . $userID . '/' . $imgName;

        Storage::disk('s3')->delete($path);

        Storage::disk('s3')->copy(
            $request->logo,
            str_replace($request->logo, $path, $request->logo)
        );

        return Storage::disk('s3')->url($path);
    }
}
