<?php

namespace App\Providers;

use App\Services\PrmSms\Contracts\PrmSmsDriverInterface;
use App\Services\PrmSms\Drivers\PrmPayamakBaseNumberDriver;
use App\Services\PrmSms\PrmSmsService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PrmSmsDriverInterface::class, PrmPayamakBaseNumberDriver::class);

        $this->app->singleton(PrmSmsService::class, function ($app) {
            return new PrmSmsService($app->make(PrmSmsDriverInterface::class));
        });
    }

    public function boot(): void
    {
    }
}
