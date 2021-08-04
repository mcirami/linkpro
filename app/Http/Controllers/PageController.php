<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class PageController extends Controller
{
    public function show(Page $page) {
        /*$page->load('links');*/

        $links = Page::find($page->id)->links;

        return view('pages.show', [
            'links' => $links,
        ]);
    }

    public function store(Request $request) {

        $user = Auth::user();

        $request->validate([
            'name' => 'required|max:255|unique:pages',
        ]);

        /*$headerIMG = 'icon-edit-light.png';
        $profileIMG = 'icon-edit-light.png';*/

        $page = $user->pages()->create([
            'name' => $request->name,
            'header_img' => null,
            'profile_img' => null,
            'title' => 'LinkPro',
            'bio' => 'Add Slogan/Intro Here',
            'is_protected' => false
        ]);

        return response()->json(['message'=> 'Successfully added', 'page_id' => $page->id]);
    }

    public function edit(Page $page) {

        $user = Auth::user();

        if ($page->user_id != $user["id"]) {
            return abort(404);
        }

        $userPages = $user->pages()->get();

        /*if (Storage::exists('public/page-headers/' . $user["id"] . "/" . $page["id"])) {
            $pageHeaderPath = $page['header_img'];
        } else {
            $pageHeaderPath = null ;
        }

        if (Storage::exists('public/profile-images/' . $user["id"] . "/" . $page["id"])) {
            $pageProfilePath = $page['profile_img'];
        } else {
            $pageProfilePath = null;
        }*/

        $links = Auth::user()->links()->where('page_id', $page["id"])
                                      ->withCount('visits')
                                      ->with('latest_visit')
                                      ->orderBy('position', 'asc')
                                      ->get();

        Javascript::put([
            'links' => $links,
            'icons' => File::glob(public_path('images/icons').'/*'),
            'defaultIcon' => File::glob(public_path('images/icon-placeholder.png')),
            'page' => $page,
/*            'page_header_path' => $pageHeaderPath,
            'page_profile_path' => $pageProfilePath,*/
            'user_pages' => $userPages
        ]);

        return view('pages.edit', [
            'links' => $links,
        ]);
    }

    public function headerUpdate(Request $request, Page $page) {

        $userID = Auth::id();

        if ($page->user_id != $userID) {
            return abort(404);
        }

        if($request->get('header_img')) {
            $image = $request->get('header_img');
            $name = time() . '.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            $img = Image::make($request->get('header_img'));
            $path = "/page-headers/" . $userID . "/" . $page->id . "/" . $name;
            Storage::put('/public' . $path , $img->stream());
        }

        $page->update(['header_img' => "/storage" . $path]);
        return response()->json('Successfully added');

        //return redirect()->back();

    }

    public function profileUpdate(Request $request, Page $page) {

        $userID = Auth::id();

        if ($page->user_id != $userID) {
            return abort(404);
        }

        if($request->get('profile_img')) {
            $image = $request->get('profile_img');
            $name = time() . '.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            $img = Image::make($request->get('profile_img'));
            $path = "/profile-images/" . $userID . "/" . $page->id . "/" . $name;
            Storage::put('/public' . $path, $img->stream());
        }

        $page->update(['profile_img' => "/storage" . $path]);
        return response()->json('Successfully added');

        //return redirect()->back();

    }

    public function nameUpdate(Request $request, Page $page) {


        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $request->validate([
            'name' => 'required|max:255',
        ]);

        $page->update(['name' => $request['name']]);
        return response()->json('Successfully updated');

        //return redirect()->back();

    }

    public function titleUpdate(Request $request, Page $page) {


        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $request->validate([
            'title' => 'required|max:255',
        ]);

        $page->update(['title' => $request['title']]);
        return response()->json('Successfully updated');

        //return redirect()->back();

    }

    public function bioUpdate(Request $request, Page $page) {

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $request->validate([
            'bio' => 'required|max:255',
        ]);

        $page->update(['bio' => $request['bio']]);
        return response()->json('Successfully updated');

        //return redirect()->back();

    }
}
