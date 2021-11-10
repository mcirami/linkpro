<?php


namespace App\Services;


use App\Models\Page;
use App\Notifications\WelcomeNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;
use function PHPUnit\Framework\isEmpty;

class PageService {

    /**
     * Create New Page
     *
     * @return $page
     */

    public function createNewPage($request) {

        $user = Auth::user();

        $path = $request->session()->get('_previous');

        $name = preg_replace("/[\s_]/", "-", strtolower($request->name));

        $userPages = $user->pages()->get();

        $default = false;
        if( $userPages->isEmpty() ) {
            $default = true;
        }

        $page = $user->pages()->create([
            'name' => $name,
            'title' => null,
            'bio' => null,
            'is_protected' => false,
            'default' => $default,
        ]);

        if(str_contains($path["url"], 'step-two')) {
            $userData = ([
                'username' => $user->username,
                'link' => $name,
                'siteUrl' => \URL::to('/'),
                'userID'  => $user["id"],
            ]);

            $user->notify(new WelcomeNotification($userData));
        }

        if ($default) {
            $user->username = $page->name;
            $user->save();
        }

        return $page;
    }

    /**
     * Create Update Page Name
     *
     * @return void
     */

    public function updatePageName($request, $page) {

        $user = Auth::user();

        $page->update(['name' => $request['name']]);

        if ($page->default) {
            $user->update(['username' => $request['name']]);
        }
    }

    /**
     * Show Edit Page
     *
     * @return $link
     */

    public function editPage($user, $page) {

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

        $userSubscription = $user->subscriptions()->first();

        Javascript::put([
            'links' => $links,
            'icons' => File::glob('images/icons'.'/*'),
            'page' => $page,
            'user_pages' => $userPages,
            'userIcons' => $userIcons,
            'allPageNames' => $pageNames,
            'userSub'   => $userSubscription
        ]);

        return $links;
    }

    /*
     *
     * Show Create Page Name at Register
     *
     */
    public function showCreatePage() {

        $pageNames = Page::all()->pluck('name')->toArray();

        Javascript::put([
            'pageNames' => $pageNames
        ]);
    }

    /**
     * Update Page Header Image
     *
     * @return void
     */
    public function updateHeaderImage($request, $userID, $page) {

        if ($request->get('header_img')) {
            $image = $request->get('header_img');
            $name = time() . '.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            $img = Image::make($request->get('header_img'));
            $path = "/page-headers/" . $userID . "/" . $page->id . "/" . $name;
            Storage::put('/public' . $path , $img->stream());
        }

        $page->update(['header_img' => "/storage" . $path]);
    }

    /**
     * Update Page Profile Image
     *
     * @return $newpath
     */
    public function updateProfileImage($request, $userID, $page) {

        if($request->get('profile_img')) {
            $image = $request->get('profile_img');
            $name = time() . '.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            $img = Image::make($request->get('profile_img'));
            $path = "/page-profile-images/" . $userID . "/" . $page->id . "/" . $name;
            Storage::put('/public' . $path, $img->stream());
        }

        $newPath = "/storage" . $path;

        $page->update(['profile_img' => $newPath]);

        return $newPath;
    }

    /**
     * Update Page Title
     *
     * @return void
     */
    public function updatePageTitle($request, $page) {

        $page->update(['title' => $request['title']]);

    }

    /**
     * Update Page Bio
     *
     * @return void
     */
    public function updatePageBio($request, $page) {

        $page->update(['bio' => $request['bio']]);

    }

    /**
     * Update Page Password
     *
     * @return void
     */
    public function updatePagePassword($request, $page) {

        $page->update([ 'is_protected' => $request['is_protected'], 'password' => $request['password'] ]);

    }

    /**
     * Authorize Page
     *
     */
    public function authorizePage($request, $page) {

        $request->validate([
            'pin' => 'required',
        ]);

        $enteredPin = $request->pin;
        $pagePin = $page->password;

        if ($enteredPin === $pagePin) {
            $request->session()->put('authorized', true);
            return redirect()->back();
        }

    }
}
