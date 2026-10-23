<?php

namespace App\Http\Requests\PrmAuth;

use Illuminate\Foundation\Http\FormRequest;

class PrmAuthIdentifierRequest extends FormRequest
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
        ];
    }
}
