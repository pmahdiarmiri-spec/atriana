<?php

namespace App\Services\PrmCompanies\PrmPublicCompanies;

use App\Enums\PrmCompanies\PrmCompanyStatus;
use App\Models\PrmCompany;
use Illuminate\Database\Eloquent\Builder;

class PrmPublicCompanyDetailService
{
    public function getApprovedCompanyById(int $companyId): PrmCompany
    {
        $company = PrmCompany::query()
            ->with(['industry'])
            ->where('id', $companyId)
            ->where('status', PrmCompanyStatus::APPROVED)
            ->where(function (Builder $query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->firstOrFail();

        $company->increment('views_count');

        return $company->refresh()->load(['industry']);
    }
}
