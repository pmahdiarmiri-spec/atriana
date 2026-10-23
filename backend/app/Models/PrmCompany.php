<?php

namespace App\Models;

use App\Enums\PrmCompanies\PrmCompanyActivityType;
use App\Enums\PrmCompanies\PrmCompanyStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrmCompany extends Model
{
    use HasFactory;

    protected $fillable = [
        'views_count',
        'user_id',
        'status',
        'admin_message',
        'name_fa',
        'name_en',
        'slogan',
        'description',
        'email',
        'mobile',
        'country',
        'phone',
        'fax',
        'website',
        'province',
        'city',
        'address',
        'postal_code',
        'registration_number',
        'national_id',
        'economic_code',
        'established_year',
        'legal_structure',
        'ownership_type',
        'activity_type',
        'is_knowledge_based',
        'is_creative',
        'is_startup',
        'is_exporter',
        'has_iso',
        'is_emc',
        'employee_count',
        'annual_revenue',
        'industry_id',
        'main_products',
        'service_id',
        'product_category_id',
        'production_capacity',
        'business_model',
        'certifications',
        'major_clients',
        'activity_scope',
        'social_linkedin',
        'social_instagram',
        'social_telegram',
        'social_whatsapp',
        'social_twitter',
        'social_facebook',
        'social_youtube',
        'social_aparat',
        'logo_path',
        'cover_path',
        'catalog_path',
        'resume_path',
        'gallery_paths',
        'cert_paths',
        'submitted_at',
        'approved_at',
        'rejected_at',
    ];

    protected function casts(): array
    {
        return [
            'views_count' => 'integer',
            'user_id' => 'integer',
            'status' => PrmCompanyStatus::class,
            'activity_type' => PrmCompanyActivityType::class,
            'is_knowledge_based' => 'boolean',
            'is_creative' => 'boolean',
            'is_startup' => 'boolean',
            'is_exporter' => 'boolean',
            'has_iso' => 'boolean',
            'is_emc' => 'boolean',
            'established_year' => 'integer',
            'industry_id' => 'integer',
            'service_id' => 'integer',
            'product_category_id' => 'integer',
            'gallery_paths' => 'array',
            'cert_paths' => 'array',
            'submitted_at' => 'datetime',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(PrmIndustry::class, 'industry_id');
    }
}
