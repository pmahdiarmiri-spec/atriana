<?php

namespace App\Services\PrmCompanies\PrmPublicCompanies;

use App\Enums\PrmCompanies\PrmCompanyStatus;
use App\Models\PrmCompany;
use App\Models\PrmIndustry;
use Illuminate\Database\Eloquent\Builder;

class PrmPublicCompanyDirectoryService
{
    private function baseApprovedQuery(): Builder
    {
        return PrmCompany::query()
            ->where('status', PrmCompanyStatus::APPROVED)
            ->where(function (Builder $query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    public function getDirectoryData(array $filters): array
    {
        $statsBase = $this->baseApprovedQuery();

        $activeCompaniesCount = (clone $statsBase)->count();

        $coveredCitiesCount = (clone $statsBase)
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->distinct('city')
            ->count('city');

        $availableCities = (clone $statsBase)
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->distinct()
            ->orderBy('city')
            ->pluck('city')
            ->values()
            ->all();

        $availableProvinces = (clone $statsBase)
            ->whereNotNull('province')
            ->where('province', '!=', '')
            ->distinct()
            ->orderBy('province')
            ->pluck('province')
            ->values()
            ->all();

        $industries = PrmIndustry::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name_fa')
            ->get();

        $query = $this->baseApprovedQuery()->with(['industry']);

        if (!empty($filters['q'])) {
            $search = trim((string) $filters['q']);
            $query->where(function (Builder $q) use ($search) {
                $q->where('name_fa', 'like', "%{$search}%")
                    ->orWhere('name_en', 'like', "%{$search}%")
                    ->orWhere('slogan', 'like', "%{$search}%")
                    ->orWhere('main_products', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('province', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['industry_id'])) {
            $query->where('industry_id', (int) $filters['industry_id']);
        }

        if (!empty($filters['activity_type'])) {
            $query->where('activity_type', (string) $filters['activity_type']);
        }

        if (!empty($filters['province'])) {
            $query->where('province', (string) $filters['province']);
        }

        if (!empty($filters['city'])) {
            $query->where('city', (string) $filters['city']);
        }

        $badgeFields = [
            'is_knowledge_based',
            'is_exporter',
            'has_iso',
            'is_startup',
            'is_creative',
            'is_emc',
        ];

        foreach ($badgeFields as $badgeField) {
            if (!empty($filters[$badgeField]) && filter_var($filters[$badgeField], FILTER_VALIDATE_BOOLEAN)) {
                $query->where($badgeField, true);
            }
        }

        $sort = $filters['sort'] ?? 'newest';
        if ($sort === 'popular') {
            $query->orderByDesc('views_count')->orderByDesc('id');
        } elseif ($sort === 'oldest') {
            $query->orderBy('approved_at')->orderBy('id');
        } else {
            $query->orderByDesc('approved_at')->orderByDesc('id');
        }

        $perPage = isset($filters['per_page']) ? min(max((int) $filters['per_page'], 1), 60) : 12;
        $paginator = $query->paginate($perPage);

        return [
            'paginator' => $paginator,
            'stats' => [
                'active_companies' => $activeCompaniesCount,
                'covered_cities' => $coveredCitiesCount,
            ],
            'filters_meta' => [
                'cities' => $availableCities,
                'provinces' => $availableProvinces,
                'industries' => $industries,
            ],
        ];
    }
}
