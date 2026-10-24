<?php

namespace App\Services\PrmSms\Contracts;

use App\Services\PrmSms\DTO\PrmSmsPayloadDto;
use App\Services\PrmSms\DTO\PrmSmsResultDto;

interface PrmSmsDriverInterface
{
    public function send(PrmSmsPayloadDto $payload): PrmSmsResultDto;
}
