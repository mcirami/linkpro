<?php

namespace App\Services;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LandingPageService {

    public function getLPData($landingPage) {

        $landingPageData = $landingPage->attributesToArray();
        $sections = $landingPage->LandingPageSections()->get()->toArray();

        $sectionArray = [];
        foreach ($sections as $index => $section) {
            $object = [
                "name" => "section_" . $index + 1,
            ];
            $merged = array_merge($section, $object);
            array_push( $sectionArray, $merged );
        }

        $landingPageData["sections"] = $sectionArray;

        return $landingPageData;
    }

    public function savePageImage($userID, $request, $key, $landingPage) {
        $imgName = $userID . '-' . $key . '.' . $request->ext; //. time() . '.' . $request->ext;
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

    public function savePageData($landingPage, $request) {
        $keys = collect($request->all())->keys();
        $slug = null;

        $landingPage->update([
            $keys[0] => $request[$keys[0]]
        ]);

        if ($keys[0] == "title") {
            $slug = Str::slug($request[$keys[0]], '-');
            $landingPage->update([
                'slug' => $slug
            ]);
        }

        return [
            "key" => $keys[0],
            "slug" => $slug
        ];
    }

    public function addLPSection($landingPage, $userID, $request) {
       return $landingPage->LandingPageSections()->create([
           'user_id' => $userID,
           'type'  => $request->type,
       ])->fresh();
    }

    public function saveLPSection($section, $request) {
       $keys = collect($request->all())->keys();

       $section->update([
           $keys[0] => $request[$keys[0]]
       ]);

       return $keys[0];
    }

    public function saveSectionImage($userID, $request, $key, $section ) {
        $imgName = $userID . '-' . $section->id . '-' . $key . '.' . $request->ext; //time() . '.' . $request->ext;
        $path = 'landing-pages/' . $userID . '/' . $imgName;

        Storage::disk('s3')->delete($path);

        Storage::disk('s3')->copy(
            $request->$key,
            str_replace($request->$key, $path, $request->$key)
        );

        $imagePath = Storage::disk('s3')->url($path);

        $section->update(['image' => $imagePath]);

        return $imagePath;
    }

    public function publishPage($page) {

        if ($page->title !== null && $page->slug !== null) {
            $page->update([
                "published" => true,
            ]);
            return true;
        } else {
            return false;
        }
    }
}
