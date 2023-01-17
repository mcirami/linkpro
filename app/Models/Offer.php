<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'course_id',
        'icon',
        'price',
        'public',
        'active',
        'published'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function Course() {
        return $this->belongsTo(Course::class);
    }
}
