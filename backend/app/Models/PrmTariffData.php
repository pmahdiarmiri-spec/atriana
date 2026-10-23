<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrmTariffData extends Model
{
    protected $table = 'tariff_data';

    public $timestamps = false;

    public $incrementing = false;

    protected $fillable = [
        'id',
        'code_raw',
        'code_formatted',
        'description',
        'chapter',
        'section',
    ];

    protected function casts(): array
    {
        return [
            'id' => 'integer',
        ];
    }
}
