<?php

use App\Http\Controllers\Api\PrmAdmin\PrmAdminAuthController;
use App\Http\Controllers\Api\PrmAdmin\PrmSuperAdminController;
use App\Http\Controllers\Api\PrmAuth\PrmAuthController;
use App\Http\Controllers\Api\PrmAuth\PrmIdentifyAuthController;
use App\Http\Controllers\Api\PrmAuth\PrmLocationController;
use App\Http\Controllers\Api\PrmAuth\PrmOtpLoginController;
use App\Http\Controllers\Api\PrmAuth\PrmPasswordLoginController;
use App\Http\Controllers\Api\PrmAuth\PrmRegisterController;
use App\Http\Controllers\Api\PrmAuth\PrmRequestPasswordResetCodeController;
use App\Http\Controllers\Api\PrmAuth\PrmResetPasswordController;
use App\Http\Controllers\Api\PrmAuth\PrmSendVerificationCodeController;
use App\Http\Controllers\Api\PrmAuth\PrmVerifyCodeController;
use App\Http\Controllers\Api\PrmSettings\PrmAccountSettingsController;
use App\Http\Controllers\Api\PrmSettings\PrmSubscriptionController;
use App\Http\Controllers\Api\PrmSupport\PrmAdminTicketController;
use App\Http\Controllers\Api\PrmSupport\PrmSuperAdminTicketController;
use App\Http\Controllers\Api\PrmSupport\PrmTicketCategoryController;
use App\Http\Controllers\Api\PrmSupport\PrmTicketController;
use App\Http\Controllers\Api\PrmTariffSearch\PrmTariffSearchController;
use App\Http\Middleware\PrmAdmin\PrmRequireAdminRoleMiddleware;
use App\Http\Middleware\PrmAdmin\PrmRequireSuperAdminMiddleware;
use App\Http\Middleware\PrmAdmin\PrmVerifyAdminGateMiddleware;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'ATRIANA API is fully operational',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::get('/schema-overview', function () {
    $tables = Schema::getTableListing();
    $schema = [];
    foreach ($tables as $table) {
        if (str_starts_with($table, 'atriana_db.')) {
            $tableName = str_replace('atriana_db.', '', $table);
            $schema[$tableName] = Schema::getColumnListing($table);
        }
    }
    return response()->json($schema);
});

Route::prefix('v1/locations')->group(function () {
    Route::get('/countries', [PrmLocationController::class, 'countries']);
    Route::get('/countries/{country}/provinces', [PrmLocationController::class, 'provinces']);
    Route::get('/provinces/{province}/cities', [PrmLocationController::class, 'cities']);
});

Route::prefix('v1/auth')->group(function () {
    Route::post('/identify', PrmIdentifyAuthController::class);
    Route::post('/verification-codes', PrmSendVerificationCodeController::class);
    Route::post('/verification-codes/verify', PrmVerifyCodeController::class);
    Route::post('/register', PrmRegisterController::class);
    Route::post('/login/password', PrmPasswordLoginController::class);
    Route::post('/login/otp', PrmOtpLoginController::class);
    Route::post('/password/reset-code', PrmRequestPasswordResetCodeController::class);
    Route::post('/password/reset', PrmResetPasswordController::class);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [PrmAuthController::class, 'me']);
        Route::post('/logout', [PrmAuthController::class, 'logout']);
    });
});

Route::prefix('v1/settings')->middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [PrmAccountSettingsController::class, 'getProfile']);
    Route::put('/profile', [PrmAccountSettingsController::class, 'updateProfile']);
    Route::post('/email/verify/request', [PrmAccountSettingsController::class, 'requestEmailVerification']);
    Route::post('/email/verify/confirm', [PrmAccountSettingsController::class, 'confirmEmailVerification']);
    Route::get('/plans', [PrmSubscriptionController::class, 'getUserPlans']);
});

Route::prefix('v1/tariffs')->middleware('auth:sanctum')->group(function () {
    Route::get('/search', [PrmTariffSearchController::class, 'search']);
});

Route::prefix('v1/support')->middleware('auth:sanctum')->group(function () {
    Route::get('/categories', [PrmTicketCategoryController::class, 'index']);
    Route::get('/tickets', [PrmTicketController::class, 'index']);
    Route::post('/tickets', [PrmTicketController::class, 'store']);
    Route::get('/tickets/{ticket}', [PrmTicketController::class, 'show']);
    Route::post('/tickets/{ticket}/messages', [PrmTicketController::class, 'addMessage']);
    Route::post('/tickets/{ticket}/close', [PrmTicketController::class, 'close']);
});

Route::prefix('v1/prm-gate/{gate_slug}')->middleware(PrmVerifyAdminGateMiddleware::class)->group(function () {
    Route::post('/login', [PrmAdminAuthController::class, 'login']);
    Route::post('/verify-otp', [PrmAdminAuthController::class, 'verifyOtp']);
});

Route::prefix('v1/admin')->middleware(['auth:sanctum', PrmRequireAdminRoleMiddleware::class])->group(function () {
    Route::get('/me', [PrmAdminAuthController::class, 'me']);
    Route::post('/logout', [PrmAdminAuthController::class, 'logout']);

    Route::prefix('tickets')->group(function () {
        Route::get('/', [PrmAdminTicketController::class, 'index']);
        Route::get('/{ticket}', [PrmAdminTicketController::class, 'show']);
        Route::post('/{ticket}/reply', [PrmAdminTicketController::class, 'reply']);
        Route::patch('/{ticket}/status', [PrmAdminTicketController::class, 'updateStatus']);
    });

    Route::middleware(PrmRequireSuperAdminMiddleware::class)->group(function () {
        Route::get('/gate/slug', [PrmSuperAdminController::class, 'getGateSlug']);
        Route::post('/gate/regenerate', [PrmSuperAdminController::class, 'regenerateGateSlug']);
        Route::post('/admins', [PrmSuperAdminController::class, 'createAdmin']);
        Route::get('/users', [PrmSuperAdminController::class, 'getUsers']);
        Route::get('/payments', [PrmSuperAdminController::class, 'getPayments']);
        Route::get('/audit-logs', [PrmSuperAdminController::class, 'getAuditLogs']);
    });
});

require __DIR__ . '/prm_companies.php';
