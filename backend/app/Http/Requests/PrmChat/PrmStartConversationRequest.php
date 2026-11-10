<?php

namespace App\Http\Requests\PrmChat;

use Illuminate\Foundation\Http\FormRequest;

class PrmStartConversationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'advertisement_id' => ['required', 'integer', 'exists:prm_advertisements,id'],
            'message' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
