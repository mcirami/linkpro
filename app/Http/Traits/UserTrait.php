<?php
namespace App\Http\Traits;

trait UserTrait {

    public function getUserSubscriptions($user) {

        return $user->subscriptions()->first();
    }

    public function getUserPages($user) {

        return $user->pages()->get();
    }
}
