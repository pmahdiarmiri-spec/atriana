<?php

namespace App\Http\Requests\PrmAuth;

use Illuminate\Foundation\Http\FormRequest;

class PrmSendVerificationCodeRequest extends FormRequest
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
            'purpose' => [
                'required',
                'string',
                'in:registration,login,password_reset',
            ],
        ];
    }
}
