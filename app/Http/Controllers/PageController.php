<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class PageController extends Controller
{
    public function show(Page $page) {

        $value = session('authorized');

        $links = $page->links()
                     ->orderBy('position', 'asc')
                     ->get();

        return view('pages.show', [
            'links' => $links,
            'page'  => $page,
            'authorized' => $value,
        ]);
    }

    public function store(Request $request) {

        $user = Auth::user();

        $request->validate([
            'name' => 'required|max:255|unique:pages',
        ]);

        $page = $user->pages()->create([
            'name' => $request->name,
            'title' => 'LinkPro',
            'bio' => 'Add Slogan/Intro Here',
            'is_protected' => false
        ]);

        return response()->json(['message'=> 'New Page Added', 'page_id' => $page->id]);
    }

    public function edit(Page $page) {

        $user = Auth::user();

        if ($page->user_id != $user["id"]) {
            return abort(404);
        }

        $userPages = $user->pages()->get();
        $userIcons = null;

        if (Storage::exists("public/icons/" . $page->user_id)) {
            $userIcons = Storage::allFiles("public/icons/" . $page->user_id);
        }

        $links = Auth::user()->links()->where('page_id', $page["id"])
                                      ->withCount('visits')
                                      ->with('latest_visit')
                                      ->orderBy('position', 'asc')
                                      ->get();
        $pageNames = Page::all()->pluck('name')->toArray();

        Javascript::put([
            'links' => $links,
            'icons' => File::glob('images/icons'.'/*'),
            'page' => $page,
            'user_pages' => $userPages,
            'userIcons' => $userIcons,
            'pageNames' => $pageNames
        ]);

        return view('pages.edit', [
            'links' => $links,
        ]);
    }

    public function updateHeaderImage(Request $request, Page $page) {

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
        return response()->json(['message' => 'Header Image Updated']);

        //return redirect()->back();

    }

    public function updateProfileImage(Request $request, Page $page) {

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
        return response()->json(['message' => 'Profile Image Updated']);

        //return redirect()->back();

    }

    public function updateName(Request $request, Page $page) {


        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $request->validate([
            'name' => 'required|max:255',
        ]);

        $page->update(['name' => $request['name']]);
        return response()->json(['message' => 'Page Name Updated']);

        //return redirect()->back();

    }

    public function updateTitle(Request $request, Page $page) {


        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $request->validate([
            'title' => 'required|max:255',
        ]);

        $page->update(['title' => $request['title']]);
        return response()->json(['message' => 'Page Title Updated']);

        //return redirect()->back();

    }

    public function updateBio(Request $request, Page $page) {

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $request->validate([
            'bio' => 'required|max:255',
        ]);

        $page->update(['bio' => $request['bio']]);
        return response()->json(['message' => 'Page Bio Updated']);

        //return redirect()->back();

    }

    public function updatePassword(Request $request, Page $page) {

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $page->update([ 'is_protected' => $request['is_protected'], 'password' => $request['password'] ]);

        return response()->json(['message' => 'Page Password Updated']);
    }

    public function pageAuth(Request $request, Page $page) {
        $request->validate([
            'pin' => 'required',
        ]);

        $enteredPin = $request->pin;
        $pagePin = $page->password;

        if ($enteredPin === $pagePin) {
            $request->session()->put('authorized', true);
            return redirect()->back();
        }

        return redirect()->back()->withErrors(['unauthorized' => 'Incorrect Pin']);
    }

    public function redirect() {
        $user = Auth::user();
        $page = $user->pages()->firstWhere('user_id', $user["id"]);
        return redirect('/dashboard/pages/' . $page->id);
    }
}
