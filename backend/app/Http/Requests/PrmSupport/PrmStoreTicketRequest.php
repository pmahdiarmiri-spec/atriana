<?php

namespace App\Http\Requests\PrmSupport;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PrmStoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', Rule::exists('prm_ticket_categories', 'id')->where('is_active', true)],
            'subject' => ['required', 'string', 'min:3', 'max:150'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'priority' => ['required', 'string', Rule::in(['low', 'normal', 'high', 'urgent'])],
        ];
    }
}
