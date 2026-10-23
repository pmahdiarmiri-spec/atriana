<?php

namespace App\Enums\PrmAuth;

enum PrmVerificationPurpose: string
{
    case REGISTRATION = 'registration';
    case LOGIN = 'login';
    case PASSWORD_RESET = 'password_reset';
    case EMAIL_VERIFICATION = 'email_verification';
}
