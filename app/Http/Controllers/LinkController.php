<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Link;
use Auth;
use Illuminate\Support\Facades\DB;
use Laracasts\Utilities\JavaScript\JavaScriptFacade;
use Illuminate\Support\Facades\File;

class LinkController extends Controller
{

    public function index() {


        $statement = DB::select("SHOW TABLE STATUS LIKE 'links'");
        $nextId = $statement[0]->Auto_increment;

        $links = Auth::user()->links()
            ->withCount('visits')
            ->with('latest_visit')
            ->get();

        JavaScriptFacade::put([
            'background' => Auth::user()->background,
            'username' => Auth::user()->username,
            'links' => $links,
            'icons' => File::glob(public_path('images/icons').'/*'),
            'defaultIcon' => File::glob(public_path('images/icon-placeholder.jpg')),
            'nextLinkId' => $nextId
        ]);

        return view('links.index', [
            'links' => $links
        ]);
    }

    public function create() {
        return view('links.create');
    }

    public function store(Request $request) {

        $request->validate([
            'name' => 'required|max:255',
            'link' => 'required|url',
            'link_icon' => 'required',
        ]);

        $link = Auth::user()->links()->create($request->only(['name', 'link', 'link_icon']));

        if ($link) {
            return redirect()->to('/dashboard/links');
        }

        return redirect()->back();
    }

    public function edit(Link $link) {

        if ($link->user_id != Auth::id()) {
            return abort(404);
        }

        return view('links.edit', [
            'link' => $link
        ]);
    }

    public function update(Request $request, Link $link) {
        if ($link->user_id != Auth::id()) {
            return abort(403);
        }

        $request->validate([
            'name' => 'required|max:255',
            'link' => 'required|url',
            'link_icon' => 'required',
        ]);

        $link->update($request->only(['name', 'lnk', 'link_icon']));

        return redirect()->to('/dashboard/links');

    }

    public function destroy(Request $request, Link $link) {
        if ($link->user_id != Auth::id()) {
            return abort(403);
        }

        $link->delete();

        return redirect()->to('/dashboard/links');
    }
}
