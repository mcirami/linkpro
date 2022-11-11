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
    protected $fillable = [
        'user_id',
        'page_id',
        'folder_id',
        'name',
        'url',
        'email',
        'phone',
        'icon',
        'position',
        'active_status',
        'embed_code',
        'type',
        'mailchimp_list_id',
        'shopify_products'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'shopify_products' => 'array'
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

    public function linkVisits() {
        return $this->hasMany(LinkVisit::class);
    }

    public function getLinkCountAttribute() {
        $user = $this->user()->get();
        $linkCount = count(Link::where('user_id', $user[0]->id)->get());
        return "{$linkCount}";
    }

    public $additional_attributes = ['link_count'];
}
