<?php

namespace App\Http\Requests\PrmSettings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PrmRequestEmailChangeRequest extends FormRequest
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
        ];
    }
}
