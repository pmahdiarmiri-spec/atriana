<?php

namespace App\Http\Requests\PrmSettings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PrmConfirmEmailChangeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email:rfc,dns',
                'max:190',
                Rule::unique('users', 'email')->ignore($this->user()?->id),
            ],
            'code' => ['required', 'string', 'size:6', 'regex:/^[0-9]+$/'],
        ];
    }
}
