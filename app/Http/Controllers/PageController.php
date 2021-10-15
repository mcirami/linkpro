<?php

namespace App\Http\Controllers;

use App\Http\Requests\PageBioRequest;
use App\Http\Requests\PageNameRequest;
use App\Http\Requests\PagePassword;
use App\Http\Requests\PageTitleRequest;
use App\Models\Page;
use App\Models\User;
use App\Services\LinkService;
use App\Services\PageService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PageController extends Controller
{
    public function show(Page $page) {

        if ($page->disabled) {
            return abort(404);
        }

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

    public function showCreatePage(PageService $pageService) {

        $pageService->showCreatePage();

        return view('pages.create');
    }

    public function store(PageNameRequest $request, PageService $pageService, LinkService $linkService) {

        $page = $pageService->createNewPage($request);

        $linkService->addLink($page);

        return response()->json(['message'=> 'New Link Added', 'page_id' => $page->id]);
    }

    public function updateName(PageNameRequest $request, PageService $pageService, Page $page) {

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $pageService->updatePageName($request, $page);

        return response()->json(['message' => 'Link Name Updated']);

    }

    public function edit(PageService $pageService, Page $page) {

        $user = Auth::user();

        if ($page->user_id != $user["id"]) {
            return abort(404);
        }

        if ( $page->disabled ) {
            return abort(404);
        }

        $links = $pageService->editPage($user, $page);

        return view('pages.edit', [
            'links' => $links,
        ]);
    }

    public function updateHeaderImage(Request $request, Page $page, PageService $pageService) {

        $userID = Auth::id();

        if ($page->user_id != $userID) {
            return abort(404);
        }

        $pageService->updateHeaderImage($request, $userID, $page);

        return response()->json(['message' => 'Header Image Updated']);

    }

    public function updateProfileImage(Request $request, Page $page, PageService $pageService) {

        $userID = Auth::id();

        if ($page->user_id != $userID) {
            return abort(404);
        }

        $pageService->updateProfileImage($request, $userID, $page);

        return response()->json(['message' => 'Profile Image Updated']);

    }

    public function updateTitle(PageTitleRequest $request, Page $page, PageService $pageService) {


        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $pageService->updatePageTitle($request, $page);

        return response()->json(['message' => 'Link Title Updated']);

    }

    public function updateBio(PageBioRequest $request, Page $page, PageService $pageService) {

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $pageService->updatePageBio($request, $page);

        return response()->json(['message' => 'Link Bio Updated']);

    }

    public function updatePassword(PagePassword $request, Page $page, PageService $pageService) {

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $pageService->updatePagePassword($request, $page);

        return response()->json(['message' => 'Link Password Updated']);
    }

    public function pageAuth(Request $request, Page $page, PageService $pageService) {

        $pageService->authorizePage($request, $page);

        return redirect()->back()->withErrors(['unauthorized' => 'Incorrect Pin']);
    }

    public function redirect() {
        $user = Auth::user();
        $page = $user->pages()->where('user_id', $user["id"])->where('default', true)->get();

        return redirect('/dashboard/pages/' . $page[0]->id);
    }
}
