<?php

namespace App\Http\Requests\PrmAdmin;

use Illuminate\Foundation\Http\FormRequest;

class PrmAdminVerifyOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'challenge_token' => ['required', 'string', 'size:64'],
            'otp_code' => ['required', 'string', 'digits:6'],
        ];
    }
}
