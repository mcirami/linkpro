<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Link as Link;
use App\Models\Page as Page;
use function Illuminate\Events\queueable;

//use Laravel\Cashier\Billable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens; //Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'avatar'
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

    /**
     * The "booted" method of the model.
     *
     * @return void
     * @noinspection PhpParamsInspection
     */
    protected static function booted()
    {
        /*static::updated(queueable(function ($customer) {
            $customer->syncStripeCustomerDetails();
        }));*/

    }

    public function pages(){
        return $this->hasMany(Page::class);
    }

    public function links(){
        return $this->hasMany(Link::class);
    }

    public function folders(){
        return $this->hasMany(Folder::class);
    }

    public function visits() {
        return $this->hasManyThrough(Visit::class, Link::class);
    }

    public function subscriptions() {
        return $this->hasOne(Subscription::class);
    }


    /*public function getRouteKeyName() {
        return 'username';
    }*/

}
