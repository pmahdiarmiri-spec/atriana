<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PrmCompanySubmitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'payment_method' => ['required', 'in:fake'],
        ];
    }

    public function messages(): array
    {
        return [
            'payment_method.required' => 'روش پرداخت الزامی است.',
            'payment_method.in' => 'روش پرداخت معتبر نیست.',
        ];
    }
}
