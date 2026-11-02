<?php

use App\Http\Controllers\Api\PrmTradeFlow\PrmTradeFlowAnalyticsController;
use App\Http\Controllers\Api\PrmTradeFlow\PrmTradeFlowExportController;
use App\Http\Controllers\Api\PrmTradeFlow\PrmTradeFlowFilterController;
use App\Http\Controllers\Api\PrmTradeFlow\PrmTradeFlowPlanController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;

Route::get('/v1/tradeflow-schema-overview', function () {
    $tables = Schema::connection('tradeflow')->getTableListing();
    $schema = [];

    foreach ($tables as $table) {
        $tableName = is_array($table) ? reset($table) : $table;
        if (str_contains($tableName, '.')) {
            $tableName = last(explode('.', $tableName));
        }
        $schema[$tableName] = Schema::connection('tradeflow')->getColumnListing($tableName);
    }

    return response()->json($schema);
});

Route::prefix('v1/tradeflow')->middleware('auth:sanctum')->group(function () {
    Route::get('/plan-status', [PrmTradeFlowPlanController::class, 'status']);
    Route::get('/options', [PrmTradeFlowFilterController::class, 'options']);
    Route::post('/summary', [PrmTradeFlowAnalyticsController::class, 'summary']);
    Route::post('/charts', [PrmTradeFlowAnalyticsController::class, 'charts']);
    Route::post('/table', [PrmTradeFlowAnalyticsController::class, 'table']);
    Route::post('/tariff-tree', [PrmTradeFlowAnalyticsController::class, 'tariffTree']);
    Route::post('/export/csv', [PrmTradeFlowExportController::class, 'exportCsv']);
});
