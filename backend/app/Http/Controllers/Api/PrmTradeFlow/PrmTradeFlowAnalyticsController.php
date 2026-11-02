<?php

namespace App\Http\Controllers\Api\PrmTradeFlow;

use App\Http\Controllers\Controller;
use App\Http\Requests\PrmTradeFlow\PrmTradeFlowFilterRequest;
use App\Services\PrmTradeFlow\PrmTradeFlowQueryService;
use Illuminate\Http\JsonResponse;

class PrmTradeFlowAnalyticsController extends Controller
{
    public function __construct(
        protected PrmTradeFlowQueryService $queryService
    ) {}

    public function summary(PrmTradeFlowFilterRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $summary = $this->queryService->getSummary($filters);

        return response()->json([
            'status' => 'success',
            'data' => $summary,
        ]);
    }

    public function charts(PrmTradeFlowFilterRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $charts = $this->queryService->getAnalyticsCharts($filters);

        return response()->json([
            'status' => 'success',
            'data' => $charts,
        ]);
    }

    public function table(PrmTradeFlowFilterRequest $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $this->queryService->getDetailTable($request->validated()),
        ]);
    }

    public function tariffTree(PrmTradeFlowFilterRequest $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $this->queryService->getTariffTree($request->validated()),
        ]);
    }
}
