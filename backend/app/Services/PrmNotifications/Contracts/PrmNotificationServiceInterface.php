<?php

namespace App\Services\PrmNotifications\Contracts;

use App\Services\PrmSms\DTO\PrmSmsResultDto;

interface PrmNotificationServiceInterface
{
    public function send(string $target, array $data): PrmSmsResultDto;
}
