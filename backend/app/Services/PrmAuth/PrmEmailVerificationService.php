<?php

namespace App\Services\PrmAuth;

use App\Mail\PrmAuth\PrmVerificationCodeMail;
use Illuminate\Support\Facades\Mail;

class PrmEmailVerificationService
{
    public function sendVerificationCode(string $email, string $code): bool
    {
        Mail::to($email)->send(new PrmVerificationCodeMail($code, 2));
        return true;
    }
}
