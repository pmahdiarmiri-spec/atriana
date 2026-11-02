<?php

namespace App\Services\PrmTradeFlow;

use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class PrmTradeFlowDimensionService
{
    public function __construct(
        private readonly PrmTradeFlowBaseQueryService $base
    ) {}

    public function continents(array $filters, string $field): array
    {
        return $this->dimension(
            $filters,
            $field,
            'continent',
            'ContinentId',
            'PersianContinentDesc'
        );
    }

    public function regions(array $filters, string $field): array
    {
        return $this->dimension(
            $filters,
            $field,
            'region',
            'RegionId',
            'PersianRegionDesc'
        );
    }

    public function unions(array $filters, string $field): array
    {
        $memberships = DB::connection('tradeflow')
            ->table('unitedcountries')
            ->select('UnitedId', 'CountryId')
            ->distinct();

        $query = $this->base->build($filters)
            ->joinSub($memberships, 'prm_tf_memberships', function (JoinClause $join): void {
                $join->on('prm_tf_memberships.CountryId', '=', 'importexportfinal.CountryId');
            })
            ->leftJoin('unitedtype', 'prm_tf_memberships.UnitedId', '=', 'unitedtype.UnitedId');

        if (!empty($filters['united_id'])) {
            $query->where('prm_tf_memberships.UnitedId', (int) $filters['united_id']);
        }

        return $query
            ->selectRaw("
                COALESCE(unitedtype.UnitedName, CONCAT('کد ', prm_tf_memberships.UnitedId)) as label,
                COALESCE(SUM(importexportfinal.{$field}), 0) as value
            ")
            ->groupBy('prm_tf_memberships.UnitedId', 'unitedtype.UnitedName')
            ->orderByDesc('value')
            ->get()
            ->map(fn ($row): array => [
                'label' => (string) $row->label,
                'value' => (string) $row->value,
            ])
            ->all();
    }

    public function seasons(array $filters, string $field): array
    {
        $values = $this->base->build($filters)
            ->whereNotNull('importexportfinal.PersianSeason')
            ->selectRaw("
                importexportfinal.PersianSeason as label,
                COALESCE(SUM(importexportfinal.{$field}), 0) as value
            ")
            ->groupBy('importexportfinal.PersianSeason')
            ->pluck('value', 'label');

        $result = [];

        foreach (['بهار', 'تابستان', 'پاییز', 'زمستان'] as $season) {
            $result[] = [
                'label' => $season,
                'value' => (string) ($values[$season] ?? '0'),
            ];
        }

        return $result;
    }

    private function dimension(
        array $filters,
        string $field,
        string $table,
        string $id,
        string $name
    ): array {
        return $this->base->build($filters)
            ->leftJoin($table, "importexportfinal.{$id}", '=', "{$table}.{$id}")
            ->selectRaw("
                COALESCE({$table}.{$name}, 'نامشخص') as label,
                COALESCE(SUM(importexportfinal.{$field}), 0) as value
            ")
            ->groupBy("importexportfinal.{$id}", "{$table}.{$name}")
            ->orderByDesc('value')
            ->get()
            ->map(fn ($row): array => [
                'label' => (string) $row->label,
                'value' => (string) $row->value,
            ])
            ->all();
    }
}
