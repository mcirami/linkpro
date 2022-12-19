<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandingPage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'published',
        'logo',
        'slogan',
        'hero',
        'header_color',
        'button_text',
        'button_text_color',
        'button_color',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
