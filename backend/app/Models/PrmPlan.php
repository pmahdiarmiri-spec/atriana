<?php

namespace App\Models;

use App\Enums\PrmSubscription\PrmPlanInterval;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrmPlan extends Model
{
    use HasFactory;

    protected $table = 'prm_plans';

    protected $fillable = [
        'slug',
        'name_fa',
        'name_en',
        'description_fa',
        'description_en',
        'price',
        'currency',
        'interval',
        'features',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'interval' => PrmPlanInterval::class,
            'features' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(PrmSubscription::class, 'plan_id');
    }
}
