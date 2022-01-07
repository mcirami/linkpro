<?php


namespace App\Services;


use App\Models\Folder;
use App\Models\Link;
use App\Models\Page;
use Illuminate\Support\Facades\Auth;

class FolderService {

    public function addNewFolder($request) {

        $user = Auth::id();
        $page = Page::findOrFail($request->pageID);

        $highestPagePos = $page->links()->where('folder_id', null)->max('position');
        $highestFolderPos = $page->folders->max("position");

        if ($highestPagePos === null && $highestFolderPos === null) {
            $position = 0;
        } else {
            $position = max($highestPagePos, $highestFolderPos) + 1;
        }

        $folder = $page->folders()->create([
            'user_id' => $user,
            'position' => $position
        ]);

        return [
            "id" => $folder->id,
            "position" => $position
        ];

    }

    public function getLinks($folder) {

        $linksArray = [];
        $folderLinkIDs = $folder->link_ids;

        if($folderLinkIDs) {
            $linkIDs = json_decode($folderLinkIDs);

            $linksArray = Link::whereIn('id', $linkIDs)->orderBy('position', 'asc')->get()->toArray();
        }

        return $linksArray;

    }

    public function updateStatus($request, $folder) {

        $folder->update($request->only(['active_status']));
        if ($request->active_status == true ) {
            $message = "Folder Enabled";
        } else {
            $message = "Folder Disabled";
        }

        return $message;
    }

    public function updateFolderName($folder, $request) {

        $folder->update(['folder_name' => $request->folderName]);
    }

    public function deleteFolder($folder) {

        $folderLinkIDs = $folder->link_ids;

        if($folderLinkIDs) {

            $linkIDs = json_decode($folderLinkIDs);
            $linksArray = Link::whereIn('id', $linkIDs)->get();

            foreach ($linksArray as $link) {
                $newLink = $link->replicate();
                $newLink->setTable( 'deleted_links' );
                $newLink->link_id = $link->id;
                $newLink->save();

                $link->delete();
            }
        }

        $folder->delete();
    }
}
