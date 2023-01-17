<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Link as Link;
use App\Models\Page as Page;
use App\Models\Referral as Referral;
use function Illuminate\Events\queueable;
use TCG\Voyager\Models\User as VoyagerUser;

use Laravel\Passport\HasApiTokens;

class User extends VoyagerUser
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'pm_last_four',
        'pm_type',
        'braintree_id',
        'email_subscription',
        'mailchimp_server',
        'mailchimp_token',
        'mailchimp_lists'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function pages(){
        return $this->hasMany(Page::class);
    }

    public function links(){
        return $this->hasMany(Link::class);
    }

    public function folders(){
        return $this->hasMany(Folder::class);
    }

    public function linkVisits() {
        return $this->hasManyThrough(LinkVisit::class, Link::class);
    }

    public function pageVisits() {
        return $this->hasManyThrough(PageVisit::class, Page::class);
    }

    public function subscriptions() {
        return $this->hasOne(Subscription::class);
    }

    public function referrals(){
        return $this->hasMany(Referral::class);
    }

    public function ShopifyStores() {
        return $this->hasMany(ShopifyStore::class);
    }

    public function LandingPage() {
        return $this->hasOne(LandingPage::class);
    }

    public function LandingPageSections() {
        return $this->hasMany(LandingPageSection::class);
    }

    public function Courses() {
        return $this->hasMany(Course::class);
    }

    public function Offers() {
        return $this->hasMany(Offer::class);
    }
}
