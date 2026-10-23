<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrmTariffSearchLog extends Model
{
    protected $table = 'prm_tariff_search_logs';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'query',
        'filters',
        'result_count',
        'duration_ms',
        'ip',
        'user_agent',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'user_id' => 'integer',
            'filters' => 'array',
            'result_count' => 'integer',
            'duration_ms' => 'float',
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
