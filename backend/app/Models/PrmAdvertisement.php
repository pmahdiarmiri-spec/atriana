<?php

namespace App\Models;

use App\Enums\PrmAdvertisements\PrmAdvertisementNature;
use App\Enums\PrmAdvertisements\PrmAdvertisementOrigin;
use App\Enums\PrmAdvertisements\PrmAdvertisementPriceType;
use App\Enums\PrmAdvertisements\PrmAdvertisementStatus;
use App\Enums\PrmAdvertisements\PrmAdvertisementType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class PrmAdvertisement extends Model
{
    use HasFactory;

    protected $table = 'prm_advertisements';

    protected $fillable = [
        'user_id',
        'company_id',
        'use_company_profile',
        'locale',
        'type',
        'origin',
        'nature',
        'category',
        'sub_category',
        'title',
        'title_en',
        'slug',
        'province',
        'city',
        'address',
        'description',
        'description_en',
        'price_type',
        'price',
        'currency',
        'moq',
        'moq_unit',
        'delivery_time',
        'delivery_type',
        'payment_terms',
        'quality_grade',
        'video_link',
        'company_name',
        'business_type',
        'activity_type',
        'experience',
        'licenses',
        'phone',
        'show_phone',
        'status',
        'admin_note',
        'payment_status',
        'request_verified_badge',
        'has_verified_badge',
        'is_laddered',
        'request_ladder',
        'views',
        'hr_full_name',
        'hr_national_code',
        'hr_email',
        'hr_job_title',
        'hr_gender',
        'hr_count',
        'hr_age_range',
        'hr_salary',
        'hr_work_area',
        'hr_work_hours',
        'hr_education',
        'hr_study_field',
        'hr_skills_desc',
        'applicant_full_name',
        'applicant_national_code',
        'applicant_birth_date',
        'applicant_education',
        'applicant_study_field',
        'applicant_marital_status',
        'applicant_military_service',
        'applicant_employment_type',
        'applicant_preferred_companies',
        'applicant_postal_address',
        'applicant_mobile',
        'applicant_phone',
        'applicant_email',
        'applicant_skills_experience',
        'applicant_resume_path',
        'applicant_terms_accepted',
    ];

    protected function casts(): array
    {
        return [
            'use_company_profile' => 'boolean',
            'show_phone' => 'boolean',
            'request_verified_badge' => 'boolean',
            'has_verified_badge' => 'boolean',
            'is_laddered' => 'boolean',
            'request_ladder' => 'boolean',
            'applicant_terms_accepted' => 'boolean',
            'price' => 'decimal:2',
            'moq' => 'decimal:2',
            'views' => 'integer',
            'applicant_birth_date' => 'date',
            'type' => PrmAdvertisementType::class,
            'origin' => PrmAdvertisementOrigin::class,
            'nature' => PrmAdvertisementNature::class,
            'price_type' => PrmAdvertisementPriceType::class,
            'status' => PrmAdvertisementStatus::class,
        ];
    }

    public static function generateUniqueSlug(string $title): string
    {
        $base = Str::slug($title, '-', null);
        if (empty($base)) {
            $base = 'ad';
        }
        $slug = $base . '-' . Str::random(6);
        while (static::where('slug', $slug)->exists()) {
            $slug = $base . '-' . Str::random(6);
        }
        return $slug;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(PrmCompany::class, 'company_id');
    }
}
