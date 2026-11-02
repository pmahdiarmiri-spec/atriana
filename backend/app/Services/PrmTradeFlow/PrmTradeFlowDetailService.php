<?php

namespace App\Services\PrmTradeFlow;

class PrmTradeFlowDetailService
{
    public function __construct(
        private readonly PrmTradeFlowBaseQueryService $base
    ) {}

    public function table(array $filters): array
    {
        $tab = $filters['tab'] ?? 'tariffs';
        $query = $this->base->build($filters);
        $tariff = 'NULL';
        $description = 'NULL';
        $country = 'NULL';
        $secondary = '0';

        if ($tab === 'tariffs') {
            $query
                ->whereNotNull('importexportfinal.Tariff')
                ->leftJoin('country', 'importexportfinal.CountryId', '=', 'country.CountryId');

            $id = 'importexportfinal.Tariff';
            $label = $id;
            $tariff = $id;
            $description = 'MAX(importexportfinal.TariffDescFromSourceBook)';
            $country = "COALESCE(country.PersianCountryDesc, 'نامشخص')";
            $secondary = 'importexportfinal.CountryId';
            $groups = [
                'importexportfinal.Tariff',
                'importexportfinal.CountryId',
                'country.PersianCountryDesc',
            ];
        } elseif (in_array($tab, ['countries', 'customs', 'provinces'], true)) {
            [$table, $column, $name] = match ($tab) {
                'countries' => ['country', 'CountryId', 'PersianCountryDesc'],
                'customs' => ['customs', 'CustomId', 'CustomDesc'],
                default => ['province', 'ProvinceId', 'ProvinceDesc'],
            };

            $id = "importexportfinal.{$column}";
            $query
                ->whereNotNull($id)
                ->leftJoin($table, $id, '=', "{$table}.{$column}");

            $label = "COALESCE({$table}.{$name}, CONCAT('کد ', {$id}))";
            $country = $tab === 'countries' ? $label : 'NULL';
            $groups = [$id, "{$table}.{$name}"];
        } elseif ($tab === 'annual') {
            $id = 'importexportfinal.YearNumber';
            $label = $id;
            $query->whereNotNull($id);
            $groups = [$id];
        } else {
            $id = 'importexportfinal.YearNumber';
            $secondary = 'importexportfinal.MonthNumber';
            $label = "CONCAT(importexportfinal.YearNumber, '/', LPAD(importexportfinal.MonthNumber, 2, '0'))";
            $query->whereNotNull($id)->whereNotNull($secondary);
            $groups = [$id, $secondary];
        }

        $requestedSort = $filters['sort_by'] ?? match ($filters['metric'] ?? 'dolar') {
            'rial' => 'total_rial',
            'weight' => 'total_weight',
            default => 'total_usd',
        };

        $sortColumn = match ($requestedSort) {
            'tariff_code' => $tab === 'tariffs' ? 'tariff_code' : 'label',
            'description' => $tab === 'tariffs' ? 'description' : 'label',
            'country' => in_array($tab, ['tariffs', 'countries'], true) ? 'country_name' : 'label',
            'total_usd', 'total_rial', 'total_weight', 'record_count' => $requestedSort,
            default => 'label',
        };

        $direction = ($filters['sort_dir'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        $paginator = $query
            ->selectRaw("
                {$id} as dimension_id,
                {$secondary} as secondary_id,
                {$label} as label,
                {$tariff} as tariff_code,
                {$description} as description,
                {$country} as country_name,
                COALESCE(SUM(importexportfinal.DolarPrice), 0) as total_usd,
                COALESCE(SUM(importexportfinal.RialPrice), 0) as total_rial,
                COALESCE(SUM(importexportfinal.Weight), 0) as total_weight,
                COUNT(*) as record_count
            ")
            ->groupBy(...$groups)
            ->orderBy($sortColumn, $direction)
            ->orderBy('dimension_id')
            ->orderBy('secondary_id')
            ->paginate(10, ['*'], 'page', (int) ($filters['page'] ?? 1));

        $rows = $paginator->getCollection()
            ->map(fn ($row): array => [
                'label' => (string) $row->label,
                'tariff_code' => $row->tariff_code === null ? null : (string) $row->tariff_code,
                'description' => $row->description === null ? null : (string) $row->description,
                'country' => $row->country_name === null ? null : (string) $row->country_name,
                'total_usd' => (string) $row->total_usd,
                'total_rial' => (string) $row->total_rial,
                'total_weight' => (string) $row->total_weight,
                'record_count' => (int) $row->record_count,
            ])
            ->all();

        return [
            'rows' => $rows,
            'page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'last_page' => $paginator->lastPage(),
        ];
    }

    public function tree(array $filters): array
    {
        $prefix = $filters['prefix'] ?? '';
        $depth = min(strlen($prefix) + 2, 8);
        $field = match ($filters['metric'] ?? 'dolar') {
            'rial' => 'RialPrice',
            'weight' => 'Weight',
            default => 'DolarPrice',
        };

        $query = $this->base->build($filters)
            ->whereNotNull('importexportfinal.Tariff')
            ->whereRaw('importexportfinal.Tariff REGEXP ?', ['^[0-9]{2}']);

        if ($prefix !== '') {
            $query->where('importexportfinal.Tariff', 'like', $prefix . '%');
        }

        $expression = "LEFT(importexportfinal.Tariff, {$depth})";

        $nodes = $query
            ->selectRaw("
                {$expression} as code,
                COALESCE(SUM(importexportfinal.{$field}), 0) as value,
                COUNT(*) as record_count
            ")
            ->groupByRaw($expression)
            ->orderByDesc('value')
            ->get()
            ->map(fn ($row): array => [
                'code' => (string) $row->code,
                'value' => (string) $row->value,
                'record_count' => (int) $row->record_count,
            ])
            ->all();

        return [
            'prefix' => $prefix,
            'depth' => $depth,
            'nodes' => $nodes,
        ];
    }
}
