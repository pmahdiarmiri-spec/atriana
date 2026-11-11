<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrmMeeting extends Model
{
    protected $table = 'prm_meetings';

    protected $fillable = [
        'creator_id',
        'code',
        'name',
        'is_active',
        'max_participants',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'max_participants' => 'integer',
    ];
}
