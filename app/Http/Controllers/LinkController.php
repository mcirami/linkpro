<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use App\Models\Link;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;
use Intervention\Image\Facades\Image;
use Laracasts\Utilities\JavaScript\JavaScriptFacade;
use Illuminate\Support\Facades\File;
use App\Http\Resources\Link as LinkResource;
use App\Http\Resources\LinkCollection;
use Illuminate\Support\Facades\Storage;

class LinkController extends Controller
{

    /*public function index(Request $request) {

        $getPage = $request->input('page');
        $page = Page::find($getPage);
        $userID = Auth::id();

        $userIcons = null;

        $links = Auth::user()->links()
            ->withCount('visits')
            ->with('latest_visit')
            ->get();

        JavaScriptFacade::put([
            'username' => Auth::user()->username,
            'links' => $links,
            'icons' => File::glob(public_path('images/icons').'/*'),
            'userIcons' => $userIcons,
            'page' => $page,
        ]);

        return view('links.index', [
            'links' => $links,
        ]);
    }*/

    /*public function create() {
        return view('links.create');
    }*/

    public function store(Request $request) {

        $highestPosition = Auth::user()->links()->max('position');
        if ($highestPosition) {
            $position = $highestPosition + 1;
        } else {
            $position = 1;
        }

        $request->validate([
            'name' => 'max:255',
            'url' => 'url',
            'page_id' => 'required|integer'
        ]);

        $link = Auth::user()->links()->create([
            'name' => $request->name,
            'url' => $request->url,
            'icon' => $request->icon,
            'page_id' => $request->page_id,
            'position' => $position,
            'active_status' => 1
        ]);

        return response()->json(['message'=> 'Link Added', 'link_id' => $link->id]);
    }

    /*public function edit(Link $link) {

        if ($link->user_id != Auth::id()) {
            return abort(404);
        }

        return view('links.edit', [
            'link' => $link
        ]);
    }*/

    public function update(Request $request, Link $link) {
        if ($link->user_id != Auth::id()) {
            return abort(403);
        }

        $request->validate([
            'name' => 'max:255',
            'url' => 'url',
        ]);

        if (str_contains($request->icon, 'data:image') ) {
            $image = $request->get('icon');
            $name = time() . '.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            $img = Image::make($request->get('icon'));
            $path = "/icons/" . $link->user_id . "/" . $name;
            Storage::put('/public' . $path , $img->stream());
            $link->update(['name' => $request->name, 'url' => $request->url, 'icon' => "/storage" . $path]);
        } else {
            $link->update($request->only(['name', 'url', 'icon']));
        }



        return response()->json(['message' => 'Link Updated']);

        //return redirect()->to('/dashboard/links');

        //return response()->setStatusCode(201);

    }

    public function updateStatus(Request $request, Link $link) {
        if ($link->user_id != Auth::id()) {
            return abort(403);
        }

        $link->update($request->only(['active_status']));

        return response()->json(['message' => 'Link Status Changed']);

        //return redirect()->to('/dashboard/links');

        //return response()->setStatusCode(201);

    }

    public function destroy(Request $request, Link $link) {
        if ($link->user_id != Auth::id()) {
            return abort(403);
        }

        $link->delete();

        return response()->json(['message' => 'Link Has Been Deleted']);
        //return response()->json(null, 204);
    }
}
