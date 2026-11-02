<?php

namespace App\Services\PrmTradeFlow;

use Illuminate\Database\Query\Builder;

class PrmTradeFlowQueryService
{
    public function __construct(
        private readonly PrmTradeFlowBaseQueryService $base,
        private readonly PrmTradeFlowOptionsService $options,
        private readonly PrmTradeFlowSummaryService $summary,
        private readonly PrmTradeFlowChartsService $charts,
        private readonly PrmTradeFlowDetailService $detail
    ) {}

    public function getFilterOptions(): array
    {
        return $this->options->get();
    }

    public function getSummary(array $filters): array
    {
        return $this->summary->get($filters);
    }

    public function getAnalyticsCharts(array $filters): array
    {
        return $this->charts->get($filters);
    }

    public function getDetailTable(array $filters): array
    {
        return $this->detail->table($filters);
    }

    public function getTariffTree(array $filters): array
    {
        return $this->detail->tree($filters);
    }

    public function getExportRecords(array $filters, int $limit = 5000): Builder
    {
        return $this->base->build($filters)
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
}
