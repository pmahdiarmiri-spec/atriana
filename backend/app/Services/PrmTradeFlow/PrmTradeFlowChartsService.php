<?php

namespace App\Services\PrmTradeFlow;

class PrmTradeFlowChartsService
{
    public function __construct(
        private readonly PrmTradeFlowCacheService $cache,
        private readonly PrmTradeFlowYearlyService $yearly,
        private readonly PrmTradeFlowRankingService $rankings,
        private readonly PrmTradeFlowDimensionService $dimensions,
        private readonly PrmTradeFlowFastChartsService $fastCharts
    ) {}

    public function get(array $filters): array
    {
        return $this->cache->remember('charts', $filters, 3600, function () use ($filters): array {
            if ($this->fastCharts->canUseFastCharts($filters)) {
                return $this->fastCharts->getCharts($filters);
            }

            $metric = $filters['metric'] ?? 'dolar';
            $field = match ($metric) {
                'rial' => 'RialPrice',
                'weight' => 'Weight',
                default => 'DolarPrice',
            };

            return [
                'annual' => $this->yearly->get($filters),
                'continents' => $this->dimensions->continents($filters, $field),
                'top_countries' => $this->rankings->get($filters, $metric, 'countries'),
                'top_tariffs' => $this->rankings->get($filters, $metric, 'tariffs'),
                'top_customs' => $this->rankings->get($filters, $metric, 'customs'),
                'top_provinces' => $this->rankings->get($filters, $metric, 'provinces'),
                'regions' => $this->dimensions->regions($filters, $field),
                'unions' => $this->dimensions->unions($filters, $field),
                'seasons' => $this->dimensions->seasons($filters, $field),
            ];
        });
    }
}
