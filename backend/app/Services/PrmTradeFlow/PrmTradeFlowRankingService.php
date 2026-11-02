<?php

namespace App\Services\PrmTradeFlow;

class PrmTradeFlowRankingService
{
    private const DIMENSIONS = [
        'countries' => ['country', 'CountryId', 'PersianCountryDesc'],
        'provinces' => ['province', 'ProvinceId', 'ProvinceDesc'],
        'customs' => ['customs', 'CustomId', 'CustomDesc'],
    ];

    public function __construct(
        private readonly PrmTradeFlowBaseQueryService $base
    ) {}

    public function get(array $filters, string $metric, string $dimension): array
    {
        $field = $this->metricField($metric);

        if ($dimension === 'tariffs') {
            return $this->tariffs($filters, $field);
        }

        [$table, $id, $name] = self::DIMENSIONS[$dimension];

        return $this->base->build($filters)
            ->leftJoin($table, "importexportfinal.{$id}", '=', "{$table}.{$id}")
            ->whereNotNull("importexportfinal.{$id}")
            ->selectRaw("
                COALESCE({$table}.{$name}, CONCAT('کد ', importexportfinal.{$id})) as label,
                COALESCE(SUM(importexportfinal.{$field}), 0) as value
            ")
            ->groupBy("importexportfinal.{$id}", "{$table}.{$name}")
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn ($row): array => [
                'label' => (string) $row->label,
                'value' => (string) $row->value,
            ])
            ->all();
    }

    private function tariffs(array $filters, string $field): array
    {
        return $this->base->build($filters)
            ->whereNotNull('importexportfinal.Tariff')
            ->selectRaw("
                importexportfinal.Tariff as label,
                MAX(importexportfinal.TariffDescFromSourceBook) as description,
                COALESCE(SUM(importexportfinal.{$field}), 0) as value
            ")
            ->groupBy('importexportfinal.Tariff')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn ($row): array => [
                'label' => (string) $row->label,
                'description' => (string) ($row->description ?? ''),
                'value' => (string) $row->value,
            ])
            ->all();
    }

    private function metricField(string $metric): string
    {
        return match ($metric) {
            'rial' => 'RialPrice',
            'weight' => 'Weight',
            default => 'DolarPrice',
        };
    }
}
