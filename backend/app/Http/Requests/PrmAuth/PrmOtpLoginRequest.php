<?php

namespace App\Http\Requests\PrmAuth;

use Illuminate\Foundation\Http\FormRequest;

class PrmOtpLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identifier' => [
                'required',
                'string',
                'max:190',
            ],
            'verification_token' => [
                'required',
                'string',
            ],
        ];
    }
}
