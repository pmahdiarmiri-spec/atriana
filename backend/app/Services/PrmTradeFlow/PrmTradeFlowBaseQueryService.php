<?php

namespace App\Services\PrmTradeFlow;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class PrmTradeFlowBaseQueryService
{
    public function __construct(
        private readonly PrmTradeFlowTradeTypeResolver $typeResolver
    ) {}

    public function build(array $filters): Builder
    {
        $query = DB::connection('tradeflow')->table('importexportfinal');

        $rawType = $this->typeResolver->resolveForRaw($filters['trade_type'] ?? null);
        if ($rawType !== null) {
            $query->where('importexportfinal.EIType', $rawType);
        }

        if (!empty($filters['year'])) {
            $query->where('importexportfinal.YearNumber', (int) $filters['year']);
        }

        if (!empty($filters['month'])) {
            $query->where('importexportfinal.MonthNumber', (int) $filters['month']);
        }

        if (!empty($filters['country_id'])) {
            $query->where('importexportfinal.CountryId', (int) $filters['country_id']);
        }

        if (!empty($filters['custom_id'])) {
            $query->where('importexportfinal.CustomId', (int) $filters['custom_id']);
        }

        if (!empty($filters['province_id'])) {
            $query->where('importexportfinal.ProvinceId', (int) $filters['province_id']);
        }

        if (!empty($filters['tariff'])) {
            $query->where('importexportfinal.Tariff', 'like', $filters['tariff'] . '%');
        }

        if (!empty($filters['continent_id'])) {
            $query->where('importexportfinal.ContinentId', (int) $filters['continent_id']);
        }

        if (!empty($filters['region_id'])) {
            $query->where('importexportfinal.RegionId', (int) $filters['region_id']);
        }

        if (!empty($filters['season'])) {
            $query->where('importexportfinal.PersianSeason', $filters['season']);
        }

        if (!empty($filters['united_id'])) {
            $countryIds = DB::connection('tradeflow')
                ->table('unitedcountries')
                ->where('UnitedId', (int) $filters['united_id'])
                ->pluck('CountryId');

            $query->whereIn('importexportfinal.CountryId', $countryIds);
        }

        if (!empty($filters['section_id'])) {
            $chapters = DB::connection('tradeflow')
                ->table('chapterinformation')
                ->where('SectionId', (int) $filters['section_id'])
                ->pluck('ChapterId')
                ->map(fn ($id) => str_pad((string) $id, 2, '0', STR_PAD_LEFT));

            $query->where(function (Builder $sub) use ($chapters) {
                foreach ($chapters as $chapter) {
                    $sub->orWhere('importexportfinal.Tariff', 'like', $chapter . '%');
                }
            });
        }

        return $query;
    }
}
