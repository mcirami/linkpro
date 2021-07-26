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
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'page_id',
        'folder_id',
        'name',
        'url',
        'icon',
        'position',
        'active_status'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function page() {
        return $this->belongsTo(Page::class);
    }

    public function folder() {
        return $this->belongsTo(Folder::class);
    }

    public function visits() {
        return $this->hasMany(Visit::class);
    }

    public function latest_visit() {
        return $this->hasOne(Visit::class)->latest();
    }
}
