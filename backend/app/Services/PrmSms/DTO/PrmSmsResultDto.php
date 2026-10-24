<?php

namespace App\Services\PrmSms\DTO;

class PrmSmsResultDto
{
    private bool $isSuccessful;
    private ?string $recId;
    private ?string $errorCode;
    private ?string $errorMessage;

    public function __construct(
        bool $isSuccessful,
        ?string $recId = null,
        ?string $errorCode = null,
        ?string $errorMessage = null
    ) {
        $this->isSuccessful = $isSuccessful;
        $this->recId = $recId;
        $this->errorCode = $errorCode;
        $this->errorMessage = $errorMessage;
    }

    public function isSuccessful(): bool
    {
        return $this->isSuccessful;
    }

    public function getRecId(): ?string
    {
        return $this->recId;
    }

    public function getErrorCode(): ?string
    {
        return $this->errorCode;
    }

    public function getErrorMessage(): ?string
    {
        return $this->errorMessage;
    }

    public function toArray(): array
    {
        return [
            'success' => $this->isSuccessful,
            'rec_id' => $this->recId,
            'error_code' => $this->errorCode,
            'error' => $this->errorMessage,
        ];
    }
}
