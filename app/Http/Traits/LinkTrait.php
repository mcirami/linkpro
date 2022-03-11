<?php


namespace App\Http\Traits;

use App\Models\Link;

trait LinkTrait {

    public function getFolderLinks($page) {

        $folderArray = [];
        $folders     = $page->folders()->orderBy( 'position', 'asc' )->get();

        if (!empty($folders)) {
            foreach ( $folders as $folder ) {
                $mylinks = json_decode( $folder->link_ids );

                $linksArray = [];

                if ( ! empty( $mylinks ) ) {

                    $linksArray = Link::whereIn( 'id', $mylinks )->orderBy( 'position', 'asc' )->get()->toArray();
                }

                $linkObject = [
                    'id'            => $folder["id"],
                    'name'          => $folder["folder_name"],
                    'type'          => 'folder',
                    'position'      => $folder["position"],
                    'links'         => $linksArray,
                    'active_status' => $folder["active_status"]
                ];

                array_push( $folderArray, $linkObject );
            }
        }

        return $folderArray;
    }
}
