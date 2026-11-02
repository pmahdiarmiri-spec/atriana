<?php

namespace App\Services\PrmTradeFlow;

class PrmTradeFlowSummaryService
{
    public function __construct(
        private readonly PrmTradeFlowBaseQueryService $base,
        private readonly PrmTradeFlowCacheService $cache
    ) {}

    public function get(array $filters): array
    {
        unset($filters['metric']);

        return $this->cache->remember('summary', $filters, 300, function () use ($filters): array {
            $result = $this->base->build($filters)
                ->selectRaw('
                    COUNT(*) as total_records,
                    COALESCE(SUM(importexportfinal.DolarPrice), 0) as total_usd,
                    COALESCE(SUM(importexportfinal.RialPrice), 0) as total_rial,
                    COALESCE(SUM(importexportfinal.Weight), 0) as total_weight,
                    COUNT(DISTINCT importexportfinal.CountryId) as unique_countries,
                    COUNT(DISTINCT importexportfinal.Tariff) as unique_tariffs,
                    COUNT(DISTINCT importexportfinal.ProvinceId) as unique_provinces,
                    COUNT(DISTINCT importexportfinal.CustomId) as unique_customs
                ')
                ->first();

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
        });
    }
}
