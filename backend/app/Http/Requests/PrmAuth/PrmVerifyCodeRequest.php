<?php

namespace App\Http\Requests\PrmAuth;

use Illuminate\Foundation\Http\FormRequest;

class PrmVerifyCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identifier' => ['required', 'string', 'max:190'],
            'code' => ['required', 'string', 'size:6', 'regex:/^[0-9]+$/'],
            'purpose' => ['required', 'string', 'in:registration,login,password_reset'],
        ];
    }
}
