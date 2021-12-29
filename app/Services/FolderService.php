<?php


namespace App\Services;


use App\Models\Page;
use Illuminate\Support\Facades\Auth;

class FolderService {

    public function addNewFolder($request) {

        $user = Auth::id();
        $page = Page::findOrFail($request->pageID);

        $highestPagePos = $page->links()->max('position');
        $highestFolderPos = $page->folders->max("position");


        if ($highestPagePos == null && $highestFolderPos == null) {
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
}
