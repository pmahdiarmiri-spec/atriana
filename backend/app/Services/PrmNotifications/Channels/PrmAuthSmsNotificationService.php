<?php

namespace App\Services\PrmNotifications\Channels;

use App\Services\PrmNotifications\Contracts\PrmNotificationServiceInterface;
use App\Services\PrmSms\DTO\PrmSmsResultDto;
use App\Services\PrmSms\PrmSmsService;

class PrmAuthSmsNotificationService implements PrmNotificationServiceInterface
{
    private PrmSmsService $smsService;

    public function __construct(PrmSmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function send(string $target, array $data): PrmSmsResultDto
    {
        return $this->sendVerificationCode($target, (string) $data['code']);
    }

    public function sendVerificationCode(string $mobile, string $code): PrmSmsResultDto
    {
        $text = "پلتفرم یکپارچه توسعه تجارت بین‌المللی کد ورود: {$code} گروه آتریانا";

        return $this->smsService->send($mobile, $text);
    }
}
