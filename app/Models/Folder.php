<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'page_id',
        'link_ids',
        'position',
        'folder_name',
        'active_status'
    ];

    protected $casts = [
        'link_ids' => 'array'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function page() {
        return $this->belongsTo(Page::class);
    }

    public function links() {
        return $this->hasMany(Link::class);
    }

    public function folderClicks() {
        return $this->hasMany(FolderClick::class);
    }
}
