<?php

namespace App\Services\PrmTradeFlow;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class PrmTradeFlowQueryService
{
    public function getFilterOptions(): array
    {
        $connection = DB::connection('tradeflow');

        $years = $connection->table('summary_yearly')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year')
            ->toArray();

        if (empty($years)) {
            $years = $connection->table('dateinfo')
                ->distinct()
                ->orderByDesc('SolarYear')
                ->pluck('SolarYear')
                ->toArray();
        }

        $months = [
            ['id' => 1, 'name' => 'فروردین'],
            ['id' => 2, 'name' => 'اردیبهشت'],
            ['id' => 3, 'name' => 'خرداد'],
            ['id' => 4, 'name' => 'تیر'],
            ['id' => 5, 'name' => 'مرداد'],
            ['id' => 6, 'name' => 'شهریور'],
            ['id' => 7, 'name' => 'مهر'],
            ['id' => 8, 'name' => 'آبان'],
            ['id' => 9, 'name' => 'آذر'],
            ['id' => 10, 'name' => 'دی'],
            ['id' => 11, 'name' => 'بهمن'],
            ['id' => 12, 'name' => 'اسفند'],
        ];

        $continents = $connection->table('continent')
            ->select('ContinentId as id', 'PersianContinentDesc as name')
            ->whereNotNull('PersianContinentDesc')
            ->orderBy('PersianContinentDesc')
            ->get();

        $countries = $connection->table('country')
            ->select('CountryId as id', 'PersianCountryDesc as name')
            ->whereNotNull('PersianCountryDesc')
            ->orderBy('PersianCountryDesc')
            ->get();

        $provinces = $connection->table('province')
            ->select('ProvinceId as id', 'ProvinceDesc as name')
            ->whereNotNull('ProvinceDesc')
            ->orderBy('ProvinceDesc')
            ->get();

        $customs = $connection->table('customs')
            ->select('CustomId as id', 'CustomDesc as name')
            ->whereNotNull('CustomDesc')
            ->orderBy('CustomDesc')
            ->get();

        $regions = $connection->table('region')
            ->select('RegionId as id', 'PersianRegionDesc as name')
            ->whereNotNull('PersianRegionDesc')
            ->orderBy('PersianRegionDesc')
            ->get();

        $unions = $connection->table('unitedtype')
            ->select('UnitedId as id', 'UnitedName as name')
            ->whereNotNull('UnitedName')
            ->orderBy('UnitedName')
            ->get();

        $sections = $connection->table('sectioninformation')
            ->select('SectionId as id', 'PersianSectionName as name')
            ->whereNotNull('PersianSectionName')
            ->orderBy('SectionId')
            ->get();

        $seasons = [
            'بهار',
            'تابستان',
            'پاییز',
            'زمستان',
        ];

        return [
            'years' => $years,
            'months' => $months,
            'continents' => $continents,
            'countries' => $countries,
            'provinces' => $provinces,
            'customs' => $customs,
            'regions' => $regions,
            'unions' => $unions,
            'sections' => $sections,
            'seasons' => $seasons,
        ];
    }

    public function getSummary(array $filters): array
    {
        $query = $this->buildBaseQuery($filters);

        $result = $query->selectRaw('
            COUNT(*) as total_records,
            COALESCE(SUM(DolarPrice), 0) as total_usd,
            COALESCE(SUM(RialPrice), 0) as total_rial,
            COALESCE(SUM(Weight), 0) as total_weight,
            COUNT(DISTINCT Tariff) as unique_tariffs,
            COUNT(DISTINCT CountryId) as unique_countries,
            COUNT(DISTINCT CustomId) as unique_customs
        ')->first();

        return [
            'total_records' => (int) ($result->total_records ?? 0),
            'total_usd' => (float) ($result->total_usd ?? 0),
            'total_rial' => (float) ($result->total_rial ?? 0),
            'total_weight' => (float) ($result->total_weight ?? 0),
            'unique_tariffs' => (int) ($result->unique_tariffs ?? 0),
            'unique_countries' => (int) ($result->unique_countries ?? 0),
            'unique_customs' => (int) ($result->unique_customs ?? 0),
        ];
    }

    public function getAnalyticsCharts(array $filters): array
    {
        $metricField = match ($filters['metric'] ?? 'dolar') {
            'rial' => 'RialPrice',
            'weight' => 'Weight',
            default => 'DolarPrice',
        };

        $timeline = $this->buildBaseQuery($filters)
            ->selectRaw("YearNumber as year, MonthNumber as month, COALESCE(SUM({$metricField}), 0) as metric_value")
            ->whereNotNull('YearNumber')
            ->groupBy('YearNumber', 'MonthNumber')
            ->orderBy('YearNumber')
            ->orderBy('MonthNumber')
            ->get();

        $topCountries = $this->buildBaseQuery($filters)
            ->leftJoin('country', 'importexportfinal.CountryId', '=', 'country.CountryId')
            ->selectRaw("COALESCE(country.PersianCountryDesc, CONCAT('کد ', importexportfinal.CountryId)) as label, COALESCE(SUM(importexportfinal.{$metricField}), 0) as value")
            ->whereNotNull('importexportfinal.CountryId')
            ->groupBy('importexportfinal.CountryId', 'country.PersianCountryDesc')
            ->orderByDesc('value')
            ->limit(10)
            ->get();

        $topTariffs = $this->buildBaseQuery($filters)
            ->selectRaw("importexportfinal.Tariff as label, COALESCE(MAX(importexportfinal.TariffDescFromSourceBook), importexportfinal.Tariff) as description, COALESCE(SUM(importexportfinal.{$metricField}), 0) as value")
            ->whereNotNull('importexportfinal.Tariff')
            ->groupBy('importexportfinal.Tariff')
            ->orderByDesc('value')
            ->limit(10)
            ->get();

        $topProvinces = $this->buildBaseQuery($filters)
            ->leftJoin('province', 'importexportfinal.ProvinceId', '=', 'province.ProvinceId')
            ->selectRaw("COALESCE(province.ProvinceDesc, CONCAT('استان ', importexportfinal.ProvinceId)) as label, COALESCE(SUM(importexportfinal.{$metricField}), 0) as value")
            ->whereNotNull('importexportfinal.ProvinceId')
            ->groupBy('importexportfinal.ProvinceId', 'province.ProvinceDesc')
            ->orderByDesc('value')
            ->limit(10)
            ->get();

        $topCustoms = $this->buildBaseQuery($filters)
            ->leftJoin('customs', 'importexportfinal.CustomId', '=', 'customs.CustomId')
            ->selectRaw("COALESCE(customs.CustomDesc, CONCAT('گمرک ', importexportfinal.CustomId)) as label, COALESCE(SUM(importexportfinal.{$metricField}), 0) as value")
            ->whereNotNull('importexportfinal.CustomId')
            ->groupBy('importexportfinal.CustomId', 'customs.CustomDesc')
            ->orderByDesc('value')
            ->limit(10)
            ->get();

        $byTradeType = $this->buildBaseQuery($filters)
            ->selectRaw("EIType as type, COALESCE(SUM({$metricField}), 0) as value")
            ->groupBy('EIType')
            ->get()
            ->map(function ($item) {
                return [
                    'label' => (int) $item->type === 1 ? 'واردات' : 'صادرات',
                    'value' => (float) $item->value,
                ];
            });

        return [
            'timeline' => $timeline,
            'top_countries' => $topCountries,
            'top_tariffs' => $topTariffs,
            'top_provinces' => $topProvinces,
            'top_customs' => $topCustoms,
            'by_trade_type' => $byTradeType,
        ];
    }

    public function getExportRecords(array $filters, int $limit = 5000): Builder
    {
        return $this->buildBaseQuery($filters)
            ->leftJoin('country', 'importexportfinal.CountryId', '=', 'country.CountryId')
            ->leftJoin('customs', 'importexportfinal.CustomId', '=', 'customs.CustomId')
            ->leftJoin('province', 'importexportfinal.ProvinceId', '=', 'province.ProvinceId')
            ->select([
                'importexportfinal.YearNumber as year',
                'importexportfinal.MonthNumber as month',
                'importexportfinal.EIType as trade_type_code',
                'importexportfinal.Tariff as tariff',
                'importexportfinal.TariffDescFromSourceBook as tariff_desc',
                'country.PersianCountryDesc as country_name',
                'province.ProvinceDesc as province_name',
                'customs.CustomDesc as customs_name',
                'importexportfinal.Weight as weight',
                'importexportfinal.RialPrice as rial_price',
                'importexportfinal.DolarPrice as dolar_price',
                'importexportfinal.PersianSeason as season',
            ])
            ->limit($limit);
    }

    private function buildBaseQuery(array $filters): Builder
    {
        $query = DB::connection('tradeflow')->table('importexportfinal');

        if (!empty($filters['trade_type']) && $filters['trade_type'] !== 'all') {
            $typeCode = $filters['trade_type'] === 'import' ? 1 : 2;
            $query->where('importexportfinal.EIType', $typeCode);
        }

        if (!empty($filters['year'])) {
            $query->where('importexportfinal.YearNumber', (int) $filters['year']);
        }

        if (!empty($filters['month'])) {
            $query->where('importexportfinal.MonthNumber', (int) $filters['month']);
        }

        if (!empty($filters['continent_id'])) {
            $query->where('importexportfinal.ContinentId', (int) $filters['continent_id']);
        }

        if (!empty($filters['country_id'])) {
            $query->where('importexportfinal.CountryId', (int) $filters['country_id']);
        }

        if (!empty($filters['province_id'])) {
            $query->where('importexportfinal.ProvinceId', (int) $filters['province_id']);
        }

        if (!empty($filters['custom_id'])) {
            $query->where('importexportfinal.CustomId', (int) $filters['custom_id']);
        }

        if (!empty($filters['region_id'])) {
            $query->where('importexportfinal.RegionId', (int) $filters['region_id']);
        }

        if (!empty($filters['season'])) {
            $query->where('importexportfinal.PersianSeason', $filters['season']);
        }

        if (!empty($filters['tariff'])) {
            $tariffClean = trim($filters['tariff']);
            $query->where(function ($subQuery) use ($tariffClean) {
                $subQuery->where('importexportfinal.Tariff', 'LIKE', "{$tariffClean}%")
                    ->orWhere('importexportfinal.TariffDescFromSourceBook', 'LIKE', "%{$tariffClean}%");
            });
        }

        if (!empty($filters['united_id'])) {
            $query->whereExists(function ($subQuery) use ($filters) {
                $subQuery->select(DB::raw(1))
                    ->from('unitedcountries')
                    ->whereColumn('unitedcountries.CountryId', 'importexportfinal.CountryId')
                    ->where('unitedcountries.UnitedId', (int) $filters['united_id']);
            });
        }

        if (!empty($filters['section_id'])) {
            $query->whereExists(function ($subQuery) use ($filters) {
                $subQuery->select(DB::raw(1))
                    ->from('tariffinformation')
                    ->whereColumn('tariffinformation.TariffCode', 'importexportfinal.Tariff')
                    ->where('tariffinformation.SectionId', (int) $filters['section_id']);
            });
        }

        return $query;
    }
}
