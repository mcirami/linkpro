<?php


namespace App\Services;

use App\Models\Folder;
use App\Models\Link;
use App\Models\Page;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class LinkService {

    public function addLink($request) {

        $page = Page::findOrFail($request->page_id);

        $highestPagePos = $page->links()->max('position');
        $highestFolderPos = $page->folders->max("position");

        if ($highestPagePos == null && $highestFolderPos == null) {
            $position = 0;
        } else {
            $position = max($highestPagePos, $highestFolderPos) + 1;
        }

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

            //$link->update(['name' => $request->name, 'url' => $request->url, 'email' => $request->email, 'phone' => $request->phone, 'icon' => $iconPath]);

        } else {
            $iconPath = $request->icon;
        }

        $link = Auth::user()->links()->create([
            'name' => $request->name,
            'url' => $request->url,
            'icon' => $iconPath,
            'page_id' => $request->page_id,
            'position' => $position,
        ]);

        return [
            "link" => $link,
            "path" => $iconPath
        ];

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
            if (array_key_exists("type", $link) && $link["type"] == "folder") {
                $currentFolder = Folder::findOrFail($link["id"]);
                if ($currentFolder->position != $index) {
                    $currentFolder->position = $index;
                    $currentFolder->save();
                }
            } else {
                $currentLink = Link::findOrFail($link["id"]);
                if ($currentLink->position != $index) {
                    $currentLink->position = $index;
                    $currentLink->save();
                }
            }
        }

    }

    public function deleteLink($link) {

        if ($link->icon && $link->url) {
            $newLink = $link->replicate();
            $newLink->setTable( 'deleted_links' );
            $newLink->link_id = $link->id;
            $newLink->save();
        }

        $link->delete();
    }
}
