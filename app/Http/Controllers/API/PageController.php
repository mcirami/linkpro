<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Link;
use App\Models\Page;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class PageController extends Controller
{

    public function headerUpdate(Request $request) {

        /*if($request->hasFile('image')) {
            $filename = $request->image->getClientOrignalName();
            $request->image->stroeAs('images', $filename, 'public');
            Auth()->user()->pages()->update(['page_header_img'=>$filename]);
        }*/

        $pageID = $request['page_id'];

        $page = Page::find($pageID);
        $userID = Auth::id();

        if($request->get('page_header_img')) {
            $image = $request->get('page_header_img');
            $name = time() . '.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            $img = Image::make($request->get('page_header_img'));
            Storage::put('/public/page-headers/'. $userID . "/" . $name, $img->stream());
        }

        $page->update(['page_header_img' => $name]);
        return response()->json('Successfully added');

        //return redirect()->back();

    }

    public function profileUpdate(Request $request) {

        /*if($request->hasFile('image')) {
            $filename = $request->image->getClientOrignalName();
            $request->image->stroeAs('images', $filename, 'public');
            Auth()->user()->pages()->update(['page_header_img'=>$filename]);
        }*/

        $userID = Auth::id();
        $page = Page::find($request['page_id']);

        if ($page->user_id != $userID) {
            return abort(404);
        }

        if($request->get('page_profile_img')) {
            $image = $request->get('page_profile_img');
            $name = time() . '.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            $img = Image::make($request->get('page_profile_img'));
            Storage::put('/public/profile-images/'. $userID . "/" . $name, $img->stream());
        }

        $page->update(['page_profile_img' => $name]);
        return response()->json('Successfully added');

        //return redirect()->back();

    }

    public function nameUpdate(Request $request) {
        $page = Page::find($request['page_id']);

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $request->validate([
            'name' => 'required|max:255|unique:page',
        ]);

        $page->update(['name' => $request['name']]);
        return response()->json('Successfully updated');

        //return redirect()->back();

    }

}
