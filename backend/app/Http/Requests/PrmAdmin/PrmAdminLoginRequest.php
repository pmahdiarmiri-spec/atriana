<?php

namespace App\Http\Requests\PrmAdmin;

use Illuminate\Foundation\Http\FormRequest;

class PrmAdminLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identifier' => ['required', 'string', 'max:190'],
            'password' => ['required', 'string'],
        ];
    }
}
