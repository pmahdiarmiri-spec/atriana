<?php

namespace App\Services\PrmSms;

use App\Services\PrmSms\Contracts\PrmSmsDriverInterface;
use App\Services\PrmSms\DTO\PrmSmsPayloadDto;
use App\Services\PrmSms\DTO\PrmSmsResultDto;

class PrmSmsService
{
    private PrmSmsDriverInterface $driver;

    public function __construct(PrmSmsDriverInterface $driver)
    {
        $this->driver = $driver;
    }

    public function send(string $to, string $text): PrmSmsResultDto
    {
        return $this->driver->send(new PrmSmsPayloadDto($to, $text));
    }
}
