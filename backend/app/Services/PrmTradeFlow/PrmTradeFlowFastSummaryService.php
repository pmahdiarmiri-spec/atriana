<?php

namespace App\Services\PrmTradeFlow;

use Illuminate\Support\Facades\DB;

class PrmTradeFlowFastSummaryService
{
    public function __construct(
        private readonly PrmTradeFlowTradeTypeResolver $typeResolver
    ) {}

    public function canUseFastSummary(array $filters): bool
    {
        $deepFilters = [
            'month',
            'continent_id',
            'country_id',
            'province_id',
            'custom_id',
            'tariff',
            'region_id',
            'united_id',
            'section_id',
            'season',
        ];

        foreach ($deepFilters as $field) {
            if (!empty($filters[$field])) {
                return false;
            }
        }

        return true;
    }

    public function getSummary(array $filters): array
    {
        $query = DB::connection('tradeflow')->table('summary_yearly');

        $resolvedType = $this->typeResolver->resolveForSummary($filters['trade_type'] ?? null);
        if ($resolvedType !== null) {
            $query->where('trade_type', $resolvedType);
        }

        if (!empty($filters['year'])) {
            $query->where('year', (int) $filters['year']);
        }

        $result = $query->selectRaw('
            COALESCE(SUM(record_count), 0) as total_records,
            COALESCE(SUM(total_value_usd), 0) as total_usd,
            COALESCE(SUM(total_value_rial), 0) as total_rial,
            COALESCE(SUM(total_weight), 0) as total_weight,
            COALESCE(MAX(unique_countries), 0) as unique_countries,
            COALESCE(MAX(unique_tariffs), 0) as unique_tariffs,
            COALESCE(MAX(unique_provinces), 0) as unique_provinces,
            COALESCE(MAX(unique_customs), 0) as unique_customs
        ')->first();

        return [
            'total_usd' => (string) ($result->total_usd ?? '0'),
            'total_rial' => (string) ($result->total_rial ?? '0'),
            'total_weight' => (string) ($result->total_weight ?? '0'),
            'total_records' => (int) ($result->total_records ?? 0),
            'unique_countries' => (int) ($result->unique_countries ?? 0),
            'unique_tariffs' => (int) ($result->unique_tariffs ?? 0),
            'unique_provinces' => (int) ($result->unique_provinces ?? 0),
            'unique_customs' => (int) ($result->unique_customs ?? 0),
        ];
    }
}
