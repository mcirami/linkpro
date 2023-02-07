<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'course_id',
        'customer_id',
        'transaction_id',
        'purchase_amount',
        'pm_last_four',
        'pm_type',
        'status',
    ];

    public function User() {
        return $this->belongsTo(User::class);
    }

    public function Course() {
        return $this->belongsTo(Course::class);
    }
}
