<?php

use App\Http\Controllers\Api\PrmMeetings\PrmMeetingController;
use Illuminate\Support\Facades\Route;

$prmMeetingsRoutes = function (): void {
    Route::post('/', [PrmMeetingController::class, 'store'])
        ->middleware('throttle:5,1');

    Route::post('/join', [PrmMeetingController::class, 'join'])
        ->middleware('throttle:5,1');

    Route::post('/{meeting}/camera/acquire', [PrmMeetingController::class, 'acquireCamera'])
        ->middleware('throttle:12,1');

    Route::post('/{meeting}/camera/release', [PrmMeetingController::class, 'releaseCamera'])
        ->middleware('throttle:12,1');

    Route::post('/{meeting}/leave', [PrmMeetingController::class, 'leave'])
        ->middleware('throttle:12,1');

    Route::post('/{meeting}/end', [PrmMeetingController::class, 'end'])
        ->middleware('throttle:5,1');
};

Route::middleware('auth:sanctum')
    ->prefix('prm/meetings')
    ->group($prmMeetingsRoutes);

Route::middleware('auth:sanctum')
    ->prefix('v1/prm/meetings')
    ->group($prmMeetingsRoutes);
