<?php

namespace App\Http\Requests\PrmAdmin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class PrmCreateAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'mobile' => ['required', 'string', 'max:25', 'unique:users,mobile'],
            'password' => ['required', 'string', Password::min(10)->letters()->mixedCase()->numbers()->symbols()],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string'],
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
        ];
    }
}
