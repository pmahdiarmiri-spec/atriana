<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrmSystemSetting extends Model
{
    protected $table = 'prm_system_settings';

    protected $fillable = [
        'key',
        'value',
    ];

    protected $hidden = [
        'value',
    ];
}
