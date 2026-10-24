<?php

namespace App\Models;

use App\Enums\PrmAdmin\PrmUserRole;
use App\Enums\PrmAuth\PrmTradeRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'mobile',
        'trade_role',
        'role',
        'permissions',
        'is_active',
        'last_login_at',
        'last_login_ip',
        'country_id',
        'province_id',
        'city_id',
        'custom_location',
        'email_verified_at',
        'mobile_verified_at',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'mobile_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'trade_role' => PrmTradeRole::class,
            'role' => PrmUserRole::class,
            'permissions' => 'array',
            'is_active' => 'boolean',
            'country_id' => 'integer',
            'province_id' => 'integer',
            'city_id' => 'integer',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === PrmUserRole::SUPER_ADMIN;
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, [PrmUserRole::ADMIN, PrmUserRole::SUPER_ADMIN], true);
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        return in_array($permission, $this->permissions ?? [], true);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(PrmSubscription::class);
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(PrmSubscription::class)
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('ends_at')->orWhere('ends_at', '>', now());
            })
            ->latestOfMany();
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(PrmAdminAuditLog::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(PrmTicket::class);
    }

    public function company(): HasOne
    {
        return $this->hasOne(PrmCompany::class);
    }

    public function advertisements(): HasMany
    {
        return $this->hasMany(PrmAdvertisement::class);
    }
}
