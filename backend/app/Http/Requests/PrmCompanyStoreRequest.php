<?php

namespace App\Http\Requests;

use App\Enums\PrmCompanies\PrmCompanyActivityType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PrmCompanyStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name_fa' => ['required', 'string', 'max:191'],
            'name_en' => ['nullable', 'string', 'max:191'],
            'slogan' => ['nullable', 'string', 'max:191'],
            'description' => ['nullable', 'string', 'max:20000'],

            'email' => ['nullable', 'email', 'max:191'],
            'mobile' => ['nullable', 'string', 'max:32'],
            'country' => ['nullable', 'string', 'max:191'],
            'phone' => ['nullable', 'string', 'max:64'],
            'fax' => ['nullable', 'string', 'max:64'],
            'website' => ['nullable', 'url', 'max:191'],

            'province' => ['nullable', 'string', 'max:191'],
            'city' => ['nullable', 'string', 'max:191'],
            'address' => ['nullable', 'string', 'max:500'],
            'postal_code' => ['nullable', 'string', 'max:32'],

            'registration_number' => ['nullable', 'string', 'max:191'],
            'national_id' => ['nullable', 'string', 'max:191'],
            'economic_code' => ['nullable', 'string', 'max:191'],
            'established_year' => ['nullable', 'integer', 'min:1200', 'max:' . (int) now()->year],

            'legal_structure' => ['nullable', 'string', 'max:191'],
            'ownership_type' => ['nullable', 'string', 'max:191'],

            'activity_type' => ['nullable', Rule::enum(PrmCompanyActivityType::class)],

            'is_knowledge_based' => ['nullable', 'boolean'],
            'is_creative' => ['nullable', 'boolean'],
            'is_startup' => ['nullable', 'boolean'],
            'is_exporter' => ['nullable', 'boolean'],
            'has_iso' => ['nullable', 'boolean'],
            'is_emc' => ['nullable', 'boolean'],

            'employee_count' => ['nullable', 'string', 'max:191'],
            'annual_revenue' => ['nullable', 'string', 'max:191'],

            'industry_id' => ['nullable', 'integer', 'exists:prm_industries,id'],

            'main_products' => ['nullable', 'string', 'max:500'],

            'service_id' => ['nullable', 'integer', 'min:1'],
            'product_category_id' => ['nullable', 'integer', 'min:1'],

            'production_capacity' => ['nullable', 'string', 'max:191'],
            'business_model' => ['nullable', 'string', 'max:191'],
            'certifications' => ['nullable', 'string', 'max:500'],
            'major_clients' => ['nullable', 'string', 'max:500'],
            'activity_scope' => ['nullable', 'string', 'max:191'],

            'social_linkedin' => ['nullable', 'string', 'max:191'],
            'social_instagram' => ['nullable', 'string', 'max:191'],
            'social_telegram' => ['nullable', 'string', 'max:191'],
            'social_whatsapp' => ['nullable', 'string', 'max:191'],
            'social_twitter' => ['nullable', 'string', 'max:191'],
            'social_facebook' => ['nullable', 'string', 'max:191'],
            'social_youtube' => ['nullable', 'string', 'max:191'],
            'social_aparat' => ['nullable', 'string', 'max:191'],
        ];
    }

    public function messages(): array
    {
        return [
            'name_fa.required' => 'نام فارسی شرکت الزامی است.',
            'name_fa.max' => 'نام فارسی شرکت نباید بیشتر از ۱۹۱ کاراکتر باشد.',
            'email.email' => 'ایمیل وارد شده معتبر نیست.',
            'website.url' => 'آدرس وب‌سایت باید یک URL معتبر باشد.',
            'industry_id.exists' => 'صنعت انتخاب شده معتبر نیست.',
            'activity_type.enum' => 'نوع فعالیت معتبر نیست. فقط تولیدی، توزیعی یا بازرگانی.',
            'established_year.max' => 'سال تأسیس نمی‌تواند بزرگ‌تر از سال جاری باشد.',
        ];
    }
}
