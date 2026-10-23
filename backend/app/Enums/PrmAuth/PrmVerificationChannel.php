<?php

namespace App\Enums\PrmAuth;

enum PrmVerificationChannel: string
{
    case EMAIL = 'email';
    case SMS = 'sms';
}
