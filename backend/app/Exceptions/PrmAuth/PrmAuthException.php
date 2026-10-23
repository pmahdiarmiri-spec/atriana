<?php

namespace App\Exceptions\PrmAuth;

use RuntimeException;

class PrmAuthException extends RuntimeException
{
    public function __construct(
        protected string $authCode,
        protected int $status = 400
    ) {
        parent::__construct($authCode, $status);
    }

    public function authCode(): string
    {
        return $this->authCode;
    }

    public function status(): int
    {
        return $this->status;
    }
}
