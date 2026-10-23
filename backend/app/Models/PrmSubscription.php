<?php

namespace App\Models;

use App\Enums\PrmSubscription\PrmSubscriptionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrmSubscription extends Model
{
    use HasFactory;

    protected $table = 'prm_subscriptions';

    protected $fillable = [
        'user_id',
        'plan_id',
        'status',
        'starts_at',
        'ends_at',
        'cancelled_at',
        'meta_data',
    ];

    protected function casts(): array
    {
        return [
            'status' => PrmSubscriptionStatus::class,
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'meta_data' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(PrmPlan::class, 'plan_id');
    }
}
