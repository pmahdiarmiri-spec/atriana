<?php

use App\Http\Controllers\Api\PrmAdmin\PrmAdChats\PrmAdminAdChatController;
use App\Http\Controllers\Api\PrmChat\PrmChatAttachmentShowController;
use App\Http\Controllers\Api\PrmChat\PrmConversationIndexController;
use App\Http\Controllers\Api\PrmChat\PrmConversationInitiateController;
use App\Http\Controllers\Api\PrmChat\PrmConversationMarkAsReadController;
use App\Http\Controllers\Api\PrmChat\PrmConversationShowController;
use App\Http\Controllers\Api\PrmChat\PrmMessageStoreController;
use App\Http\Middleware\PrmAdmin\PrmRequireAdminRoleMiddleware;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/chat')->middleware('auth:sanctum')->group(function () {
    Route::get('/conversations', PrmConversationIndexController::class);
    Route::post('/conversations/initiate', PrmConversationInitiateController::class);
    Route::get('/conversations/{id}', PrmConversationShowController::class);
    Route::post('/conversations/{id}/messages', PrmMessageStoreController::class);
    Route::post('/conversations/{id}/read', PrmConversationMarkAsReadController::class);
    Route::get('/attachments/{attachment}', PrmChatAttachmentShowController::class);
});

Route::prefix('v1/admin/ad-chats')
    ->middleware(['auth:sanctum', PrmRequireAdminRoleMiddleware::class])
    ->group(function () {
        Route::get('/ads', [PrmAdminAdChatController::class, 'advertisements']);
        Route::get('/ads/{advertisement}/conversations', [PrmAdminAdChatController::class, 'conversations']);
        Route::get('/conversations/{conversation}', [PrmAdminAdChatController::class, 'conversation']);
        Route::get('/attachments/{attachment}', [PrmAdminAdChatController::class, 'attachment']);
    });
