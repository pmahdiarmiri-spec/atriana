<?php

namespace App\Actions\PrmAuth;

use App\Enums\PrmAuth\PrmVerificationChannel;
use App\Enums\PrmAuth\PrmVerificationPurpose;
use App\Services\PrmAuth\PrmVerificationCodeService;

class PrmCreateVerificationCodeAction
{
    public function __construct(
        protected PrmVerificationCodeService $service
    ) {}

    public function execute(
        string $identifier,
        PrmVerificationChannel $channel,
        PrmVerificationPurpose $purpose,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): void {
        $this->service->generateAndSend(
            $identifier,
            $channel,
            $purpose,
            $ipAddress,
            $userAgent
        );
    }
}
