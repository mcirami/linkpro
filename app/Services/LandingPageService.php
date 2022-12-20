<?php

namespace App\Services;
use Illuminate\Support\Facades\Storage;

class LandingPageService {

    public function savePageImage($userID, $request, $key, $landingPage) {
        $imgName = $userID . '-' . time() . '.' . $request->ext;
        $path = 'landing-pages/' . $userID . '/' . $imgName;

        Storage::disk('s3')->delete($path);

        Storage::disk('s3')->copy(
            $request->$key,
            str_replace($request->$key, $path, $request->$key)
        );

        $imagePath = Storage::disk('s3')->url($path);

        $landingPage->update([$key => $imagePath]);

        return $imagePath;
    }

    public function savePageText($landingPage, $request) {
        $keys = collect($request->all())->keys();

        $landingPage->update([$keys[0] => $request[$keys[0]] ]);

        return $keys[0];
    }

    public function savePageColor($landingPage, $request) {
        $keys = collect($request->all())->keys();

        $landingPage->update([$keys[0] => $request[$keys[0]] ]);

        return $keys[0];
    }
}
