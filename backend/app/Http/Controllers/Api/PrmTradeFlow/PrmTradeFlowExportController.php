<?php

namespace App\Http\Controllers\Api\PrmTradeFlow;

use App\Http\Controllers\Controller;
use App\Http\Requests\PrmTradeFlow\PrmTradeFlowFilterRequest;
use App\Services\PrmTradeFlow\PrmTradeFlowQueryService;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PrmTradeFlowExportController extends Controller
{
    public function __construct(
        protected PrmTradeFlowQueryService $queryService
    ) {}

    public function exportCsv(PrmTradeFlowFilterRequest $request): StreamedResponse
    {
        $filters = $request->validated();
        $records = $this->queryService->getExportRecords($filters, 5000);

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="tradeflow-export-' . now()->format('Y-m-d-His') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($records) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($handle, [
                'سال',
                'ماه',
                'نوع تجارت',
                'کد تعرفه',
                'شرح کالا',
                'کشور طرف معامله',
                'استان مبدا/مقصد',
                'گمرک',
                'وزن خالص (کیلوگرم)',
                'ارزش ریالی',
                'ارزش دلاری',
                'فصل',
            ]);

            $records->chunk(1000, function ($chunk) use ($handle) {
                foreach ($chunk as $row) {
                    fputcsv($handle, [
                        $row->year,
                        $row->month,
                        (int) $row->trade_type_code === 1 ? 'واردات' : 'صادرات',
                        $row->tariff,
                        $row->tariff_desc,
                        $row->country_name,
                        $row->province_name,
                        $row->customs_name,
                        $row->weight,
                        $row->rial_price,
                        $row->dolar_price,
                        $row->season,
                    ]);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }
}
