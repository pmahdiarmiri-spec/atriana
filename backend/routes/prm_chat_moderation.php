<?php

use App\Http\Controllers\Api\PrmAdmin\PrmAdChats\PrmAdminChatActionsController;
use App\Http\Controllers\Api\PrmAdmin\PrmAdChats\PrmAdminChatReportsController;
use App\Http\Controllers\Api\PrmChat\PrmChatModerationStatusController;
use App\Http\Controllers\Api\PrmChat\PrmChatReportController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('v1')->group(function (): void {
    Route::get('chat/conversations/{id}/moderation', PrmChatModerationStatusController::class);
    Route::post('chat/conversations/{id}/reports', PrmChatReportController::class)
        ->middleware('throttle:3,60');

    Route::get('admin/chat-moderation/reports', [PrmAdminChatReportsController::class, 'index']);
    Route::patch('admin/chat-moderation/reports/{id}', [PrmAdminChatReportsController::class, 'update']);
    Route::get('admin/chat-moderation/conversations/{id}', [PrmAdminChatActionsController::class, 'show']);
    Route::post('admin/chat-moderation/conversations/{id}/actions', [PrmAdminChatActionsController::class, 'store']);
});
