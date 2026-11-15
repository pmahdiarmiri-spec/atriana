<?php

namespace App\Http\Requests\PrmAdmin\Companies;

use App\Enums\PrmCompanies\PrmCompanyUpdateStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class PrmAdminCompanyUpdateReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', new Enum(PrmCompanyUpdateStatus::class)],
            'admin_message' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
