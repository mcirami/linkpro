<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
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
        'intro_text',
        'intro_text_color',
        'intro_background_color',
    ];

    /**
     * The attributes that should be hidden for arrays.
     */
    protected $hidden = ['created_at', 'updated_at'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function CourseSections() {
        return $this->hasMany(CourseSection::class);
    }

    public function Offer() {
        return $this->hasOne(Offer::class);
    }
}
