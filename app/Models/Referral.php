<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'referral_id'
    ];

    public function users() {
        return $this->belongsTo(User::class);
    }

    public function getUserIDAttribute() {
        $ref      = Referral::where( 'id', $this->id )->get()->toArray();
        $userID   = $ref[0]["user_id"];
        $user     = User::where( 'id', $userID )->get()->toArray();
        $username = $user["0"]["username"];

        return "{$username}";
    }

    public function getReferralIDAttribute() {
        $ref      = Referral::where( 'id', $this->id )->get()->toArray();
        $userID   = $ref[0]["referral_id"];
        $user     = User::where( 'id', $userID )->get()->toArray();
        $username = $user["0"]["username"];

        return "{$username}";
    }

    public function getReferralCountAttribute() {
        $ref      = Referral::where( 'id', $this->id )->get()->toArray();
        $userID   = $ref[0]["user_id"];
        $user     = User::where( 'id', $userID )->get()->toArray();
        $referralCount = count( \App\Models\Referral::where('user_id', $user)->get());
        return "{$referralCount}";
    }

    public $additional_attributes = ['referral_count'];
}
