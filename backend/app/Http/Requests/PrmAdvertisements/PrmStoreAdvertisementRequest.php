<?php

namespace App\Http\Requests\PrmAdvertisements;

use App\Enums\PrmAdvertisements\PrmAdvertisementNature;
use App\Enums\PrmAdvertisements\PrmAdvertisementOrigin;
use App\Enums\PrmAdvertisements\PrmAdvertisementPriceType;
use App\Enums\PrmAdvertisements\PrmAdvertisementType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class PrmStoreAdvertisementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'locale' => ['nullable', 'string', 'max:10'],
            'type' => ['required', new Enum(PrmAdvertisementType::class)],
            'origin' => ['required', new Enum(PrmAdvertisementOrigin::class)],
            'nature' => ['required', new Enum(PrmAdvertisementNature::class)],
            'category' => ['required', 'string', 'max:191'],
            'sub_category' => ['nullable', 'string', 'max:191'],
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'title_en' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:191'],
            'city' => ['nullable', 'string', 'max:191'],
            'address' => ['nullable', 'string', 'max:1000'],
            'description' => ['required', 'string', 'min:10'],
            'description_en' => ['nullable', 'string'],
            'price_type' => ['required', new Enum(PrmAdvertisementPriceType::class)],
            'price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:32'],
            'moq' => ['nullable', 'numeric', 'min:0'],
            'moq_unit' => ['nullable', 'string', 'max:64'],
            'delivery_time' => ['nullable', 'string', 'max:128'],
            'delivery_type' => ['nullable', 'string', 'max:128'],
            'payment_terms' => ['nullable', 'string', 'max:128'],
            'quality_grade' => ['nullable', 'string', 'max:64'],
            'video_link' => ['nullable', 'string', 'max:500'],
            'company_name' => ['nullable', 'string', 'max:191'],
            'business_type' => ['nullable', 'string', 'max:128'],
            'activity_type' => ['nullable', 'string', 'max:128'],
            'experience' => ['nullable', 'string', 'max:128'],
            'licenses' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:64'],
            'show_phone' => ['nullable', 'boolean'],
            'use_company_profile' => ['nullable', 'boolean'],
            'request_verified_badge' => ['nullable', 'boolean'],
            'request_ladder' => ['nullable', 'boolean'],
            'hr_full_name' => ['nullable', 'string', 'max:191'],
            'hr_national_code' => ['nullable', 'string', 'max:32'],
            'hr_email' => ['nullable', 'email', 'max:191'],
            'hr_job_title' => ['nullable', 'string', 'max:191'],
            'hr_gender' => ['nullable', 'string', 'max:32'],
            'hr_count' => ['nullable', 'integer', 'min:1'],
            'hr_age_range' => ['nullable', 'string', 'max:64'],
            'hr_salary' => ['nullable', 'string', 'max:128'],
            'hr_work_area' => ['nullable', 'string', 'max:191'],
            'hr_work_hours' => ['nullable', 'string', 'max:128'],
            'hr_education' => ['nullable', 'string', 'max:128'],
            'hr_study_field' => ['nullable', 'string', 'max:191'],
            'hr_skills_desc' => ['nullable', 'string'],
            'applicant_full_name' => ['nullable', 'string', 'max:191'],
            'applicant_national_code' => ['nullable', 'string', 'max:32'],
            'applicant_birth_date' => ['nullable', 'date'],
            'applicant_education' => ['nullable', 'string', 'max:128'],
            'applicant_study_field' => ['nullable', 'string', 'max:191'],
            'applicant_marital_status' => ['nullable', 'string', 'max:32'],
            'applicant_military_service' => ['nullable', 'string', 'max:64'],
            'applicant_employment_type' => ['nullable', 'string', 'max:64'],
            'applicant_preferred_companies' => ['nullable', 'string', 'max:255'],
            'applicant_postal_address' => ['nullable', 'string'],
            'applicant_mobile' => ['nullable', 'string', 'max:32'],
            'applicant_phone' => ['nullable', 'string', 'max:64'],
            'applicant_email' => ['nullable', 'email', 'max:191'],
            'applicant_skills_experience' => ['nullable', 'string'],
            'applicant_resume_path' => ['nullable', 'string', 'max:500'],
            'applicant_terms_accepted' => ['nullable', 'boolean'],
        ];
    }
}
