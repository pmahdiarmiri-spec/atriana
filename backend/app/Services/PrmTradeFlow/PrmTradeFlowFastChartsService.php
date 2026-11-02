<?php

namespace App\Services\PrmTradeFlow;

use Illuminate\Support\Facades\DB;

class PrmTradeFlowFastChartsService
{
    public function __construct(
        private readonly PrmTradeFlowTradeTypeResolver $typeResolver
    ) {}

    public function canUseFastCharts(array $filters): bool
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

    public function getCharts(array $filters): array
    {
        $metric = $filters['metric'] ?? 'dolar';
        $metricColumn = match ($metric) {
            'rial' => 'total_value_rial',
            'weight' => 'total_weight',
            default => 'total_value_usd',
        };

        return [
            'annual' => $this->getAnnual($filters),
            'continents' => $this->getContinents($filters, $metricColumn),
            'top_countries' => $this->getTopCountries($filters, $metricColumn),
            'top_tariffs' => $this->getTopTariffs($filters, $metricColumn),
            'top_customs' => $this->getTopCustoms($filters, $metricColumn),
            'top_provinces' => $this->getTopProvinces($filters, $metricColumn),
            'regions' => $this->getRegions($filters, $metricColumn),
            'unions' => $this->getUnions($filters, $metricColumn),
            'seasons' => $this->getSeasons($filters, $metric),
        ];
    }

    private function getAnnual(array $filters): array
    {
        $query = DB::connection('tradeflow')->table('summary_yearly');

        $resolvedType = $this->typeResolver->resolveForSummary($filters['trade_type'] ?? null);
        if ($resolvedType !== null) {
            $query->where('trade_type', $resolvedType);
        }

        return $query->selectRaw('
            year,
            COALESCE(SUM(total_value_usd), 0) as usd,
            COALESCE(SUM(total_value_rial), 0) as rial,
            COALESCE(SUM(total_weight), 0) as weight
        ')
        ->groupBy('year')
        ->orderBy('year')
        ->get()
        ->map(fn ($r) => [
            'year' => (int) $r->year,
            'usd' => (string) $r->usd,
            'rial' => (string) $r->rial,
            'weight' => (string) $r->weight,
        ])
        ->all();
    }

    private function getContinents(array $filters, string $metricCol): array
    {
        $query = DB::connection('tradeflow')->table('summary_by_continent');
        $this->applyBaseFilters($query, $filters);

        return $query->selectRaw("continent as label, COALESCE(SUM({$metricCol}), 0) as value")
            ->whereNotNull('continent')
            ->groupBy('continent')
            ->orderByDesc('value')
            ->get()
            ->map(fn ($r) => ['label' => (string) $r->label, 'value' => (string) $r->value])
            ->all();
    }

    private function getTopCountries(array $filters, string $metricCol): array
    {
        $query = DB::connection('tradeflow')->table('summary_by_country');
        $this->applyBaseFilters($query, $filters);

        return $query->selectRaw("country as label, COALESCE(SUM({$metricCol}), 0) as value")
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn ($r) => ['label' => (string) $r->label, 'value' => (string) $r->value])
            ->all();
    }

    private function getTopTariffs(array $filters, string $metricCol): array
    {
        $query = DB::connection('tradeflow')->table('summary_by_tariff');
        $this->applyBaseFilters($query, $filters);

        return $query->selectRaw("tariff_code as label, MAX(tariff_desc) as description, COALESCE(SUM({$metricCol}), 0) as value")
            ->whereNotNull('tariff_code')
            ->groupBy('tariff_code')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn ($r) => [
                'label' => (string) $r->label,
                'description' => (string) ($r->description ?? ''),
                'value' => (string) $r->value,
            ])
            ->all();
    }

    private function getTopCustoms(array $filters, string $metricCol): array
    {
        $query = DB::connection('tradeflow')->table('summary_by_customs');
        $this->applyBaseFilters($query, $filters);

        return $query->selectRaw("customs_name as label, COALESCE(SUM({$metricCol}), 0) as value")
            ->whereNotNull('customs_name')
            ->groupBy('customs_name')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn ($r) => ['label' => (string) $r->label, 'value' => (string) $r->value])
            ->all();
    }

    private function getTopProvinces(array $filters, string $metricCol): array
    {
        $query = DB::connection('tradeflow')->table('summary_by_province');
        $this->applyBaseFilters($query, $filters);

        return $query->selectRaw("province as label, COALESCE(SUM({$metricCol}), 0) as value")
            ->whereNotNull('province')
            ->groupBy('province')
            ->orderByDesc('value')
            ->limit(10)
            ->get()
            ->map(fn ($r) => ['label' => (string) $r->label, 'value' => (string) $r->value])
            ->all();
    }

    private function getRegions(array $filters, string $metricCol): array
    {
        $query = DB::connection('tradeflow')->table('summary_by_region');
        $this->applyBaseFilters($query, $filters);

        $metricField = match ($metricCol) {
            'total_value_rial' => 'total_value',
            'total_weight' => 'total_weight',
            default => 'total_value',
        };

        return $query->selectRaw("COALESCE(region_fa, region_en) as label, COALESCE(SUM({$metricField}), 0) as value")
            ->groupBy(DB::raw("COALESCE(region_fa, region_en)"))
            ->orderByDesc('value')
            ->get()
            ->map(fn ($r) => ['label' => (string) $r->label, 'value' => (string) $r->value])
            ->all();
    }

    private function getUnions(array $filters, string $metricCol): array
    {
        $query = DB::connection('tradeflow')->table('summary_by_united');
        $this->applyBaseFilters($query, $filters);

        $metricField = match ($metricCol) {
            'total_value_rial' => 'total_value',
            'total_weight' => 'total_weight',
            default => 'total_value',
        };

        return $query->selectRaw("united_name as label, COALESCE(SUM({$metricField}), 0) as value")
            ->groupBy('united_name')
            ->orderByDesc('value')
            ->get()
            ->map(fn ($r) => ['label' => (string) $r->label, 'value' => (string) $r->value])
            ->all();
    }

    private function getSeasons(array $filters, string $metric): array
    {
        $query = DB::connection('tradeflow')->table('summary_by_season');
        $this->applyBaseFilters($query, $filters);

        $col = match ($metric) {
            'rial' => 'total_rial',
            'weight' => 'total_weight',
            default => 'total_value',
        };

        $seasons = ['بهار', 'تابستان', 'پاییز', 'زمستان'];
        $dbData = $query->selectRaw("season_fa as label, COALESCE(SUM({$col}), 0) as value")
            ->groupBy('season_fa')
            ->pluck('value', 'label');

        $result = [];
        foreach ($seasons as $s) {
            $result[] = [
                'label' => $s,
                'value' => (string) ($dbData[$s] ?? '0'),
            ];
        }

        return $result;
    }

    private function applyBaseFilters($query, array $filters): void
    {
        $resolvedType = $this->typeResolver->resolveForSummary($filters['trade_type'] ?? null);
        if ($resolvedType !== null) {
            $query->where('trade_type', $resolvedType);
        }

        if (!empty($filters['year'])) {
            $query->where('year', (int) $filters['year']);
        }
    }
}
