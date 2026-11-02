<?php

namespace App\Services\PrmTradeFlow;

class PrmTradeFlowYearlyService
{
    public function __construct(
        private readonly PrmTradeFlowBaseQueryService $base
    ) {}

    public function get(array $filters): array
    {
        return $this->base->build($filters)
            ->whereNotNull('importexportfinal.YearNumber')
            ->selectRaw('
                importexportfinal.YearNumber as year,
                COALESCE(SUM(importexportfinal.DolarPrice), 0) as usd,
                COALESCE(SUM(importexportfinal.RialPrice), 0) as rial,
                COALESCE(SUM(importexportfinal.Weight), 0) as weight
            ')
            ->groupBy('importexportfinal.YearNumber')
            ->orderBy('importexportfinal.YearNumber')
            ->get()
            ->map(fn ($row): array => [
                'year' => (int) $row->year,
                'usd' => (string) $row->usd,
                'rial' => (string) $row->rial,
                'weight' => (string) $row->weight,
            ])
            ->all();
    }
}
