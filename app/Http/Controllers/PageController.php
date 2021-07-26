<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Laracasts\Utilities\JavaScript\JavaScriptFacade;

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

        $headerIMG = 'default-header-img.jpg';
        $profileIMG = 'default-profile-img.png';

        $page = $user->pages()->create([
            'name' => $request->name,
            'header_img' => $headerIMG,
            'profile_img' => $profileIMG,
            'title' => $request->name,
            'bio' => 'This is where your bio goes']);

        return response()->json(['message'=> 'Successfully added', 'page_id' => $page->id]);
    }

    public function edit(Page $page) {

        $user = Auth::user();

        $userPages = $user->pages()->get();
/*        $firstPage = $userPages->first()->pluck('id');
        print_r($userPages);*/

        if (Storage::exists('public/page-headers/' . $user["id"] . "/" . $page["id"])) {
            $pageHeaderPath = '/storage/page-headers/' . $user["id"] . "/" . $page["id"];
        } else {
            $pageHeaderPath = '/storage/page-headers/';
        }

        if (Storage::exists('public/profile-images/' . $user["id"] . "/" . $page["id"])) {
            $pageProfilePath = '/storage/profile-images/' . $user["id"] . "/" . $page["id"];
        } else {
            $pageProfilePath = '/storage/profile-images/';
        }

        $links = Auth::user()->links()->where('page_id', $page["id"])
                                      ->withCount('visits')
                                      ->with('latest_visit')
                                      ->orderBy('position', 'asc')
                                      ->get();

        JavaScriptFacade::put([
            'username' => Auth::user()->username,
            'links' => $links,
            'icons' => File::glob(public_path('images/icons').'/*'),
            'defaultIcon' => File::glob(public_path('images/icon-placeholder.jpg')),
            'page' => $page,
            'page_header_path' => $pageHeaderPath,
            'page_profile_path' => $pageProfilePath,
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
            Storage::put('/public/page-headers/'. $userID . "/" . $page->id . "/" . $name, $img->stream());
        }

        $page->update(['header_img' => $name]);
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
            Storage::put('/public/profile-images/'. $userID . "/" . $page->id . "/" . $name, $img->stream());
        }

        $page->update(['profile_img' => $name]);
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
}
