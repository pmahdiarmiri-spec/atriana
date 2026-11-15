<?php

namespace App\Models;

use App\Enums\PrmCompanies\PrmCompanyUpdateStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrmCompanyUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'status',
        'data',
        'admin_message',
    ];

    protected function casts(): array
    {
        return [
            'status' => PrmCompanyUpdateStatus::class,
            'data' => 'array',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(PrmCompany::class, 'company_id');
    }
}
