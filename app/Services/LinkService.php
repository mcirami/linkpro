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

        } else {
            $iconPath = $request->icon;
        }

        if ($request->folder_id) {

            $folderID = $request->folder_id;
            $folder = Folder::findOrFail($folderID);
            $folderLinkIDs = $folder->link_ids;

            if($folderLinkIDs) {
                $linksArray = [];
                $linkIDs = json_decode($folderLinkIDs);

                foreach($linkIDs as $linkID) {
                    $linkPosition = Link::where('id', $linkID)->get()->pluck('position')->toArray();

                    array_push($linksArray, $linkPosition);
                }

                $max = max($linksArray);
                $position = $max[0] + 1;

            } else {
                $linkIDs = [];
                $position = 0;
            }

            $link = Auth::user()->links()->create([
                'name' => $request->name,
                'url' => $request->url ? : null,
                'email' => $request->email ? : null,
                'phone' => $request->phone ? : null,
                'icon' => $iconPath,
                'page_id' => $request->page_id,
                'position' => $position,
                'folder_id' => $request->folder_id
            ]);

            array_push($linkIDs, $link->id);

            $folder->update(['link_ids' => json_encode($linkIDs)]);


        } else {
            $highestPagePos = $page->links()->max('position');
            $highestFolderPos = $page->folders->max("position");

            if ($highestPagePos == null && $highestFolderPos == null) {
                $position = 0;
            } else {
                $position = max($highestPagePos, $highestFolderPos) + 1;
            }

            $link = Auth::user()->links()->create([
                'name' => $request->name,
                'url' => $request->url ? : null,
                'email' => $request->email ? : null,
                'phone' => $request->phone ? : null,
                'icon' => $iconPath,
                'page_id' => $request->page_id,
                'position' => $position,
            ]);
        }

        return [
            "link" => $link,
            "path" => $request->phone
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
