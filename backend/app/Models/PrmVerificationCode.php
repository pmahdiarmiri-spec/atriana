<?php

namespace App\Models;

use App\Enums\PrmAuth\PrmVerificationChannel;
use App\Enums\PrmAuth\PrmVerificationPurpose;
use Illuminate\Database\Eloquent\Model;

class PrmVerificationCode extends Model
{
    protected $table = 'prm_verification_codes';

    protected $fillable = [
        'identifier',
        'channel',
        'purpose',
        'code_hash',
        'token_hash',
        'attempts',
        'expires_at',
        'verified_at',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'channel' => PrmVerificationChannel::class,
            'purpose' => PrmVerificationPurpose::class,
            'expires_at' => 'datetime',
            'verified_at' => 'datetime',
            'attempts' => 'integer',
        ];
    }
}
