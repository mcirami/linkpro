<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        'page_header_img',
        'page_profile_img',
        'display_name',
        'page_bio'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function links() {
        return $this->hasMany(Link::class);
    }

    public function getRouteKeyName() {
        return 'name';
    }
}
