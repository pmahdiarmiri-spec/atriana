<?php

namespace App\Services\PrmSms\DTO;

class PrmSmsPayloadDto
{
    private string $to;
    private string $text;

    public function __construct(string $to, string $text)
    {
        $this->to = $to;
        $this->text = $text;
    }

    public function getTo(): string
    {
        return $this->to;
    }

    public function getText(): string
    {
        return $this->text;
    }
}
