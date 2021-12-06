<?php

namespace App\Http\Controllers;

use App\Http\Requests\PageBioRequest;
use App\Http\Requests\PageNameRequest;
use App\Http\Requests\PagePassword;
use App\Http\Requests\PageTitleRequest;
use App\Models\Page;
use App\Services\LinkService;
use App\Services\PageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Traits\UserTrait;
use Illuminate\Support\Facades\Storage;

class PageController extends Controller
{

    use UserTrait;

    /**
     * @param Page $page
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\never
     */
    public function show(Page $page) {

        if ($page->disabled || !$page->active) {
            return abort(404);
        }

        $value = session('authorized');

        if($page->custom) {

            return view('pages.custom.' . $page->name, [
                'page'  => $page,
                'authorized' => $value,
            ]);

        } else {
            $links = $page->links()
                          ->orderBy('position', 'asc')
                          ->get();

            return view('pages.show', [
                'links' => $links,
                'page'  => $page,
                'authorized' => $value,
            ]);
        }

    }

    /**
     * @param PageService $pageService
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\never
     */
    public function showCreatePage(PageService $pageService) {

        $user = Auth::user();

        if( count($this->getUserPages($user)) > 0) {
            return abort(404);
        }

        $pageService->showCreatePage();

        return view('pages.create');
    }

    /**
     * @param PageNameRequest $request
     * @param PageService $pageService
     * @param LinkService $linkService
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(PageNameRequest $request, PageService $pageService, LinkService $linkService) {

        $page = $pageService->createNewPage($request);

        $linkService->addLink($page);

        return response()->json(['message'=> 'New Link Added', 'page_id' => $page->id]);
    }

    /**
     * @param PageNameRequest $request
     * @param PageService $pageService
     * @param Page $page
     *
     * @return \Illuminate\Http\JsonResponse|\never
     */
    public function updateName(PageNameRequest $request, PageService $pageService, Page $page) {

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $pageService->updatePageName($request, $page);

        return response()->json(['message' => 'Link Name Updated']);

    }

    /**
     * @param PageService $pageService
     * @param Page $page
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\never
     */
    public function edit(PageService $pageService, Page $page) {

        $user = Auth::user();

        if ($page->user_id != $user["id"]) {
            return abort(404);
        }

        if ( !$page->active ) {
            return abort(404);
        }

        $links = $pageService->editPage($user, $page);

        return view('pages.edit', [
            'links' => $links,
        ]);
    }

    /**
     * @param Request $request
     * @param Page $page
     * @param PageService $pageService
     *
     * @return \Illuminate\Http\JsonResponse|\never
     */
    public function updateHeaderImage(Request $request, Page $page, PageService $pageService) {

        $userID = Auth::id();

        if ($page->user_id != $userID) {
            return abort(404);
        }

        $pageService->updateHeaderImage($request, $userID, $page);

        return response()->json(['message' => 'Header Image Updated']);

    }

    /**
     * @param Request $request
     * @param Page $page
     * @param PageService $pageService
     *
     * @return \Illuminate\Http\JsonResponse|\never
     */
    public function updateProfileImage(Request $request, Page $page, PageService $pageService) {

        $userID = Auth::id();

        if ($page->user_id != $userID) {
            return abort(404);
        }

        $imgPath = $pageService->updateProfileImage($request, $userID, $page);

        return response()->json(['message' => 'Profile Image Updated', 'imgPath' => $imgPath]);

    }

    /**
     * @param PageTitleRequest $request
     * @param Page $page
     * @param PageService $pageService
     *
     * @return \Illuminate\Http\JsonResponse|\never
     */
    public function updateTitle(PageTitleRequest $request, Page $page, PageService $pageService) {


        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $pageService->updatePageTitle($request, $page);

        return response()->json(['message' => 'Link Title Updated']);

    }

    /**
     * @param PageBioRequest $request
     * @param Page $page
     * @param PageService $pageService
     *
     * @return \Illuminate\Http\JsonResponse|\never
     */
    public function updateBio(PageBioRequest $request, Page $page, PageService $pageService) {

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $pageService->updatePageBio($request, $page);

        return response()->json(['message' => 'Link Bio Updated']);

    }

    /**
     * @param PagePassword $request
     * @param Page $page
     * @param PageService $pageService
     *
     * @return \Illuminate\Http\JsonResponse| \never
     */
    public function updatePassword(PagePassword $request, Page $page, PageService $pageService) {

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $pageService->updatePagePassword($request, $page);

        return response()->json(['message' => 'Link Password Updated']);
    }

    /**
     * @param Request $request
     * @param Page $page
     * @param PageService $pageService
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function pageAuth(Request $request, Page $page, PageService $pageService) {

        $pageService->authorizePage($request, $page);

        return redirect()->back()->withErrors(['unauthorized' => 'Incorrect Pin']);
    }

    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function redirect() {
        $user = Auth::user();
        $page = $user->pages()->where('user_id', $user["id"])->where('default', true)->get();

        return redirect('/dashboard/pages/' . $page[0]->id);
    }

    /**
     * @param $request
     * @param $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function pageStatus(Request $request, Page $page) {
        $page->disabled = $request->disabled;
        $page->save();

        return response()->json(['message' => $request->disabled]);
    }
}
