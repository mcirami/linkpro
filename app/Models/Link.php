<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Link extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'sub_links' => 'array',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function page() {
        return $this->belongsTo(Page::class);
    }

    public function visits() {
        return $this->hasMany(Visit::class);
    }

    public function latest_visit() {
        return $this->hasOne(Visit::class)->latest();
    }
}
