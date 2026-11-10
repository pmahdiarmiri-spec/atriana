<?php

namespace App\Http\Requests\PrmChat;

use Illuminate\Foundation\Http\FormRequest;

class PrmSendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'max:5000'],
        ];
    }
}
