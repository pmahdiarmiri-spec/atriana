<?php

namespace App\Http\Requests\PrmSupport;

use Illuminate\Foundation\Http\FormRequest;

class PrmStoreTicketMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'min:2', 'max:5000'],
        ];
    }
}
