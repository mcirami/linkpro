<?php

namespace App\Http\Controllers;
use App\Models\Link;
use App\Models\Page;

use Illuminate\Http\Request;

class PageController extends Controller
{
    public function show(Page $page) {
        /*$page->load('links');*/

        $links = Page::find($page->id)->links;

        return view('pages.show', [
            'links' => $links
        ]);
    }

    public function headerUpload(Request $request) {

        $request->validate([
            'page_header_img' => 'required',
        ]);


    }

    public function getRouteKeyName() {
        return 'name';
    }

}
