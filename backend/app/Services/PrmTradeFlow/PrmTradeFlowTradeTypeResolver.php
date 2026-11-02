<?php

namespace App\Services\PrmTradeFlow;

use Illuminate\Support\Facades\DB;

class PrmTradeFlowTradeTypeResolver
{
    private static ?array $summaryTypes = null;
    private static ?array $eiTypes = null;

    public function resolveForSummary(mixed $input): ?string
    {
        if (empty($input) || $input === 'all') {
            return null;
        }

        $inputStr = trim((string) $input);
        $normalizedInput = strtolower($inputStr);

        $this->loadSummaryTypes();

        if (in_array($inputStr, self::$summaryTypes, true)) {
            return $inputStr;
        }

        $isExport = in_array($normalizedInput, ['export', 'exports', 'صادرات', '2'], true);
        $isImport = in_array($normalizedInput, ['import', 'imports', 'واردات', '1'], true);

        foreach (self::$summaryTypes as $type) {
            $typeLower = strtolower(trim((string) $type));
            if ($isExport && ($typeLower === 'export' || $type === 'صادرات' || $typeLower === '2')) {
                return (string) $type;
            }
            if ($isImport && ($typeLower === 'import' || $type === 'واردات' || $typeLower === '1')) {
                return (string) $type;
            }
        }

        return $isExport ? 'export' : ($isImport ? 'import' : $inputStr);
    }

    public function resolveForRaw(mixed $input): ?string
    {
        if (empty($input) || $input === 'all') {
            return null;
        }

        $inputStr = trim((string) $input);
        $normalizedInput = strtolower($inputStr);

        $this->loadEiTypes();

        $isExport = in_array($normalizedInput, ['export', 'exports', 'صادرات', '2'], true);
        $isImport = in_array($normalizedInput, ['import', 'imports', 'واردات', '1'], true);

        if ($isExport) {
            foreach (self::$eiTypes as $code => $desc) {
                if (str_contains($desc, 'صادر') || str_contains(strtolower($desc), 'export') || (string)$code === '2') {
                    return (string) $code;
                }
            }
            return '2';
        }

        if ($isImport) {
            foreach (self::$eiTypes as $code => $desc) {
                if (str_contains($desc, 'وارد') || str_contains(strtolower($desc), 'import') || (string)$code === '1') {
                    return (string) $code;
                }
            }
            return '1';
        }

        return $inputStr;
    }

    private function loadSummaryTypes(): void
    {
        if (self::$summaryTypes !== null) {
            return;
        }

        try {
            self::$summaryTypes = DB::connection('tradeflow')
                ->table('summary_yearly')
                ->distinct()
                ->pluck('trade_type')
                ->filter()
                ->values()
                ->all();
        } catch (\Throwable) {
            self::$summaryTypes = ['export', 'import'];
        }
    }

    private function loadEiTypes(): void
    {
        if (self::$eiTypes !== null) {
            return;
        }

        try {
            self::$eiTypes = DB::connection('tradeflow')
                ->table('eitype')
                ->pluck('EITypeDesc', 'EITypeCode')
                ->all();
        } catch (\Throwable) {
            self::$eiTypes = ['1' => 'واردات', '2' => 'صادرات'];
        }
    }
}
