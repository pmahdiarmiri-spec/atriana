<?php

namespace App\Http\Controllers\Api\PrmTradeFlow;

use App\Http\Controllers\Controller;
use App\Services\PrmTradeFlow\PrmTradeFlowQueryService;
use Illuminate\Http\JsonResponse;

class PrmTradeFlowFilterController extends Controller
{
    public function __construct(
        protected PrmTradeFlowQueryService $queryService
    ) {}

    public function options(): JsonResponse
    {
        $options = $this->queryService->getFilterOptions();

        return response()->json([
            'status' => 'success',
            'data' => $options,
        ]);
    }
}
