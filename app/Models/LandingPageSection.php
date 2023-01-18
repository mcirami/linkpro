<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandingPageSection extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'landing_page_id',
        'type',
        'text',
        'bg_color',
        'text_color',
        'button',
        'button_position',
        'image',
        'button_link'
    ];

    /**
     * The attributes that should be hidden for arrays.
     */
    protected $hidden = ['created_at', 'updated_at'];

    public function LandingPage() {
        return $this->belongsTo(LandingPage::class);
    }

    public function User() {
        return $this->belongsTo(User::class);
    }
}
