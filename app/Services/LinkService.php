<?php


namespace App\Services;

use App\Models\Folder;
use App\Models\Link;
use App\Models\Page;
use App\Http\Traits\LinkTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class LinkService {

    use LinkTrait;

    /**
     * @param $page
     *
     * @return array|mixed
     */
    public function getAllLinks($page) {


        $allLinks = $page->links()->where('folder_id', null)
                     ->orderBy('position', 'asc')
                     ->get()->toArray();

        $folderLinks = $this->getFolderLinks($page);

        if (!empty($folderLinks)) {
            $allLinks = array_merge( $allLinks, $folderLinks );
            usort($allLinks, array($this, "sortArray" ));
        }

        return $allLinks;
    }

    /**
     * @param $request
     *
     * @return array
     */
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

            if($folderLinkIDs && !empty($folderLinkIDs)) {
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
            $highestPagePos = $page->links()->where('folder_id', null)->max('position');
            $highestFolderPos = $page->folders->max("position");

            if ($highestPagePos === null && $highestFolderPos === null) {
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
            "path" => $iconPath
        ];

    }

    /**
     * @param $request
     * @param $link
     *
     * @return string|null
     */
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

            $link->update([
                'name' => $request->name,
                'url' => $request->url ? : null,
                'email' => $request->email ? : null,
                'phone' => $request->phone ? : null,
                'icon' => $iconPath,
            ]);

            /*$link->update(['name' => $request->name, 'url' => $request->url, 'email' => $request->email, 'phone' => $request->phone, 'icon' => $iconPath]);*/
            return $iconPath;

        } else {
            $link->update([
                'name' => $request->name,
                'url' => $request->url ? : null,
                'email' => $request->email ? : null,
                'phone' => $request->phone ? : null,
                'icon' => $request->icon ? : null,
            ]);
            /*$link->update($request->only(['name', 'url', 'email', 'phone', 'icon']));*/
        }

        return null;
    }

    /**
     * @param $request
     * @param $link
     *
     * @return string
     */
    public function updateLinkStatus($request, $link) {

        $link->update($request->only(['active_status']));
        if ($request->active_status == true ) {
            $message = "Icon Enabled";
        } else {
            $message = "Icon Disabled";
        }

        return $message;
    }

    /**
     * @param $request
     */
    public function updateLinksPositions($request) {

        if ($request["userLinks"] && !empty($request['userLinks']) ) {
            foreach ( $request["userLinks"] as $index => $link ) {
                if ( array_key_exists( "type", $link ) && $link["type"] == "folder" ) {
                    $currentFolder = Folder::findOrFail( $link["id"] );
                    if ( $currentFolder["position"] != $index ) {
                        $currentFolder["position"] = $index;
                        $currentFolder->save();
                    }
                } else {
                    $currentLink = Link::findOrFail( $link["id"] );
                    if ( $currentLink["position"] != $index ) {
                        $currentLink["position"] = $index;
                        $currentLink->save();
                    }
                }
            }
        }

        if (array_key_exists( "folderLinks", $request ) && !empty($request['folderLinks'])) {
            foreach ($request['folderLinks'] as $index => $folderLink) {
                $link = Link::findOrFail( $folderLink["id"] );
                if ($link["position"] != $index) {
                    $link["position"] = $index;
                    $link->save();
                }
            }
        }

    }

    /**
     * @param $link
     */
    public function deleteLink($link) {

        if ($link->icon && $link->url) {
            $newLink = $link->replicate();
            $newLink->setTable( 'deleted_links' );
            $newLink->link_id = $link->id;
            $newLink->save();
        }

        if ($link->folder_id) {
            $folder = Folder::findOrFail($link->folder_id);
            $linkIDs = json_decode($folder->link_ids);

            $newArray = array_values(array_filter($linkIDs, fn ($m) => $m != $link->id));

            if(count($newArray) > 0) {
                $folder->update(['link_ids' => json_encode($newArray)]);
            } else {
                $folder->update(['link_ids' => null]);
            }
        }

        $link->delete();
    }

    /**
     * @param $a
     * @param $b
     *
     * @return int
     */
    public function sortArray($a, $b) {

        return ($a["position"] > $b["position"] ? +1 : -1);
    }
}
