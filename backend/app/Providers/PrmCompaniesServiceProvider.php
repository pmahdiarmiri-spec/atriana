<?php

namespace App\Providers;

use App\Services\PrmCompanies\PrmCompanyRegistration\PrmCompanyDraftUpsertService;
use App\Services\PrmCompanies\PrmCompanyRegistration\PrmCompanyRegistrationPriceService;
use App\Services\PrmCompanies\PrmCompanyRegistration\PrmCompanySubmitService;
use App\Services\PrmCompanyPayments\Fake\PrmFakeCompanyPaymentService;
use App\Services\PrmUploads\PrmCompanyUploads\PrmCompanyUploadPathService;
use App\Services\PrmUploads\PrmCompanyUploads\PrmCompanyUploadService;
use Illuminate\Support\ServiceProvider;

class PrmCompaniesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(PrmCompanyUploadPathService::class);
        $this->app->singleton(PrmCompanyUploadService::class);
        $this->app->singleton(PrmCompanyRegistrationPriceService::class);
        $this->app->singleton(PrmFakeCompanyPaymentService::class);
        $this->app->singleton(PrmCompanyDraftUpsertService::class);
        $this->app->singleton(PrmCompanySubmitService::class);
    }

    public function boot(): void
    {
    }
}
