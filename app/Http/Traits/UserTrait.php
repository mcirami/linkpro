<?php
namespace App\Http\Traits;

trait UserTrait {

    public function getUserSubscriptions($user) {

        return $user->subscriptions()->first();
    }

    public function getUserPages($user) {

        return $user->pages()->get();
    }

    public function getDefaultUserPage($user) {

        return $user->pages()->where('default', true)->pluck('name');
    }

    public function enableUsersPages($user) {
        $pages = $this->getUserPages($user);

        if (count($pages) > 1) {
            foreach ( $pages as $page ) {
                if ( !$page->default && !$page->active ) {
                    $page->active = true;
                    $page->save();
                }
            }
        }
    }
}
