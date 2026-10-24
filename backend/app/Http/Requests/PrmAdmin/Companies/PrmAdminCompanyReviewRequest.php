<?php

namespace App\Http\Requests\PrmAdmin\Companies;

use App\Enums\PrmCompanies\PrmCompanyStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class PrmAdminCompanyReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', new Enum(PrmCompanyStatus::class)],
            'admin_message' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
