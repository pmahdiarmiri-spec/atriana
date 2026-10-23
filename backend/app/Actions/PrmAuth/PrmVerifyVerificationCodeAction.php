<?php

namespace App\Actions\PrmAuth;

use App\Enums\PrmAuth\PrmVerificationPurpose;
use App\Services\PrmAuth\PrmVerificationCodeService;

class PrmVerifyVerificationCodeAction
{
    public function __construct(
        protected PrmVerificationCodeService $service
    ) {}

    public function execute(string $identifier, string $code, PrmVerificationPurpose $purpose): string
    {
        return $this->service->verify($identifier, $code, $purpose);
    }
}
