<?php

use App\Http\Controllers\Api\PrmAdvertisements\Public\PrmAdvertisementPublicIndexController;
use App\Http\Controllers\Api\PrmAdvertisements\Public\PrmAdvertisementPublicShowController;
use App\Http\Controllers\Api\PrmAdvertisements\User\PrmAdvertisementIndexController;
use App\Http\Controllers\Api\PrmAdvertisements\User\PrmAdvertisementMetaController;
use App\Http\Controllers\Api\PrmAdvertisements\User\PrmAdvertisementStoreController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/advertisements')->group(function () {
    Route::get('/', PrmAdvertisementPublicIndexController::class);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/meta', PrmAdvertisementMetaController::class);
        Route::get('/my', PrmAdvertisementIndexController::class);
        Route::post('/my', PrmAdvertisementStoreController::class);
    });

    Route::get('/{slug}', PrmAdvertisementPublicShowController::class)
        ->where('slug', '[^\/]+');
});
