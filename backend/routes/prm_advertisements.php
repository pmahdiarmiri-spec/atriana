<?php

use App\Http\Controllers\Api\PrmAdvertisements\User\PrmAdvertisementIndexController;
use App\Http\Controllers\Api\PrmAdvertisements\User\PrmAdvertisementMetaController;
use App\Http\Controllers\Api\PrmAdvertisements\User\PrmAdvertisementStoreController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/advertisements')->middleware('auth:sanctum')->group(function () {
    Route::get('/meta', PrmAdvertisementMetaController::class);
    Route::get('/my', PrmAdvertisementIndexController::class);
    Route::post('/my', PrmAdvertisementStoreController::class);
});
