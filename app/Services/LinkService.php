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
            'active_status' => 1
        ]);

        return $link;
    }

    public function updateLink($request, $link) {

        if (str_contains($request->icon, 'data:image') ) {
            $image = $request->get('icon');
            $name = time() . '.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            $img = Image::make($request->get('icon'));
            $path = "/icons/" . $link->user_id . "/" . $name;
            Storage::put('/public' . $path , $img->stream());
            $link->update(['name' => $request->name, 'url' => $request->url, 'icon' => "/storage" . $path]);
            return $path;
        } else {
            $link->update($request->only(['name', 'url', 'icon']));
        }
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
            Link::where('id', $link["id"])->update(['position' => $index ]);
        }

    }

    public function deleteLink($link) {
        $link->delete();
    }
}
