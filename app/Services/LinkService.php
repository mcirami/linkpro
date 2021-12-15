<?php


namespace App\Services;

use App\Models\Link;
use App\Models\Page;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class LinkService {

    public function addLink($request) {

        $page = Page::findOrFail($request->id);

        $highestPosition = $page->links()->max('position');
        if ($highestPosition === null) {
            $position = 0;
        } else {
            $position = $highestPosition + 1;
        }

        $link = Auth::user()->links()->create([
            'name' => null,
            'url' => null,
            'icon' => null,
            'page_id' => $request->id,
            'position' => $position,
        ]);

        return $link;
    }

    public function updateLink($request, $link) {

        if (str_contains($request->icon, 'tmp/') ) {
            $userID = Auth::id();
            $imgName = $userID . '-' . time() . '.' . $request->ext;
            $path = 'custom-icons/' . $userID . '/' . $imgName;

            Storage::disk('s3')->delete($path);
            Storage::disk('s3')->copy(
                $request->icon,
                str_replace($request->icon, $path, $request->icon)
            );


            $iconPath = Storage::disk('s3')->url($path);

            $link->update(['name' => $request->name, 'url' => $request->url, 'email' => $request->email, 'phone' => $request->phone, 'icon' => $iconPath]);
            return $iconPath;

        } else {
            $link->update($request->only(['name', 'url', 'email', 'phone', 'icon']));
        }

        return null;
    }

    public function updateLinkStatus($request, $link) {

        $link->update($request->only(['active_status']));
        if ($request->active_status == true ) {
            $message = "Link Enabled";
        } else {
            $message = "Link Disabled";
        }

        return $message;
    }

    public function updateLinksPositions($linksArray) {

        foreach($linksArray["userLinks"] as $index => $link) {
            $currentLink = Link::findOrFail($link["id"]);
            if ($currentLink->position != $index) {
                $currentLink->position = $index;
                $currentLink->save();
            }

        }

    }

    public function deleteLink($link) {
        $link->delete();
    }
}
