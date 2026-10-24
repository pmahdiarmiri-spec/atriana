<?php

use App\Http\Controllers\Api\PrmCompanies\Public\PrmPublicCompanyIndexController;
use App\Http\Controllers\Api\PrmCompanies\Public\PrmPublicCompanyShowController;
use App\Http\Controllers\Api\PrmCompanies\User\Industries\PrmCompanyIndustryIndexController;
use App\Http\Controllers\Api\PrmCompanies\User\MyCompany\PrmMyCompanyRenewController;
use App\Http\Controllers\Api\PrmCompanies\User\MyCompany\PrmMyCompanyShowController;
use App\Http\Controllers\Api\PrmCompanies\User\MyCompany\PrmMyCompanySubmitController;
use App\Http\Controllers\Api\PrmCompanies\User\MyCompany\PrmMyCompanyUploadController;
use App\Http\Controllers\Api\PrmCompanies\User\MyCompany\PrmMyCompanyUpsertDraftController;
use App\Http\Controllers\Api\PrmCompanyPayments\User\MyCompanyPayment\PrmMyCompanyPaymentPayFakeController;
use App\Http\Controllers\Api\PrmCompanyPayments\User\MyCompanyPayment\PrmMyCompanyPaymentQuoteController;
use App\Http\Controllers\Api\PrmLocations\PrmCityIndexController;
use App\Http\Controllers\Api\PrmLocations\PrmCountryIndexController;
use App\Http\Controllers\Api\PrmLocations\PrmProvinceIndexController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/locations')->group(function () {
    Route::get('/countries', PrmCountryIndexController::class);
    Route::get('/provinces', PrmProvinceIndexController::class);
    Route::get('/cities', PrmCityIndexController::class);
});

Route::prefix('v1/companies')->group(function () {
    Route::get('/public', PrmPublicCompanyIndexController::class);
    Route::get('/public/{company}', PrmPublicCompanyShowController::class)->whereNumber('company');
    Route::get('/industries', PrmCompanyIndustryIndexController::class);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/my', PrmMyCompanyShowController::class);
        Route::put('/my/draft', PrmMyCompanyUpsertDraftController::class);
        Route::post('/my/upload', PrmMyCompanyUploadController::class);
        Route::post('/my/submit', PrmMyCompanySubmitController::class);
        Route::post('/my/renew', PrmMyCompanyRenewController::class);
    });
});

Route::prefix('v1/company-payments')->middleware('auth:sanctum')->group(function () {
    Route::get('/my/quote', PrmMyCompanyPaymentQuoteController::class);
    Route::post('/my/pay/fake', PrmMyCompanyPaymentPayFakeController::class);
});
