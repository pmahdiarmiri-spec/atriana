<?php

namespace App\Services\PrmTradeFlow;

use Illuminate\Support\Facades\DB;

class PrmTradeFlowOptionsService
{
    public function __construct(
        private readonly PrmTradeFlowCacheService $cache
    ) {}

    public function get(): array
    {
        return $this->cache->remember('options', [], 3600, function (): array {
            $connection = DB::connection('tradeflow');

            $years = $connection->table('summary_yearly')
                ->distinct()
                ->orderByDesc('year')
                ->pluck('year')
                ->map(fn ($year): int => (int) $year)
                ->all();

            if ($years === []) {
                $years = $connection->table('dateinfo')
                    ->distinct()
                    ->orderByDesc('SolarYear')
                    ->pluck('SolarYear')
                    ->map(fn ($year): int => (int) $year)
                    ->all();
            }

            $names = [
                'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
                'مرداد', 'شهریور', 'مهر', 'آبان',
                'آذر', 'دی', 'بهمن', 'اسفند',
            ];

            $months = [];

            foreach ($names as $index => $name) {
                $months[] = ['id' => $index + 1, 'name' => $name];
            }

            return [
                'years' => $years,
                'months' => $months,
                'continents' => $this->items('continent', 'ContinentId', 'PersianContinentDesc'),
                'countries' => $this->items('country', 'CountryId', 'PersianCountryDesc'),
                'provinces' => $this->items('province', 'ProvinceId', 'ProvinceDesc'),
                'customs' => $this->items('customs', 'CustomId', 'CustomDesc'),
                'regions' => $this->items('region', 'RegionId', 'PersianRegionDesc'),
                'unions' => $this->items('unitedtype', 'UnitedId', 'UnitedName'),
                'sections' => $this->items('sectioninformation', 'SectionId', 'PersianSectionName'),
                'seasons' => ['بهار', 'تابستان', 'پاییز', 'زمستان'],
            ];
        });
    }

    private function items(string $table, string $id, string $name): array
    {
        return DB::connection('tradeflow')
            ->table($table)
            ->select("{$id} as id", "{$name} as name")
            ->whereNotNull($name)
            ->orderBy($name)
            ->get()
            ->map(fn ($item): array => [
                'id' => $item->id,
                'name' => (string) $item->name,
            ])
            ->all();
    }
}
