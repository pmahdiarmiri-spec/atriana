<?php

namespace App\Http\Resources\PrmCompanies;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PrmCompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $logoUrl = $this->logo_path ? Storage::url($this->logo_path) : null;
        $coverUrl = $this->cover_path ? Storage::url($this->cover_path) : null;
        $catalogUrl = $this->catalog_path ? Storage::url($this->catalog_path) : null;
        $resumeUrl = $this->resume_path ? Storage::url($this->resume_path) : null;

        $gallery = is_array($this->gallery_paths) ? array_values(array_filter($this->gallery_paths)) : [];
        $certs = is_array($this->cert_paths) ? array_values(array_filter($this->cert_paths)) : [];

        return [
            'id' => $this->id,
            'views_count' => $this->views_count,
            'user_id' => $this->user_id,
            'status' => $this->status?->value,
            'admin_message' => $this->admin_message,
            'name_fa' => $this->name_fa,
            'name_en' => $this->name_en,
            'slogan' => $this->slogan,
            'description' => $this->description,
            'email' => $this->email,
            'mobile' => $this->mobile,
            'country' => $this->country,
            'phone' => $this->phone,
            'fax' => $this->fax,
            'website' => $this->website,
            'province' => $this->province,
            'city' => $this->city,
            'address' => $this->address,
            'postal_code' => $this->postal_code,
            'registration_number' => $this->registration_number,
            'national_id' => $this->national_id,
            'economic_code' => $this->economic_code,
            'established_year' => $this->established_year,
            'legal_structure' => $this->legal_structure,
            'ownership_type' => $this->ownership_type,
            'activity_type' => $this->activity_type?->value,
            'is_knowledge_based' => $this->is_knowledge_based,
            'is_creative' => $this->is_creative,
            'is_startup' => $this->is_startup,
            'is_exporter' => $this->is_exporter,
            'has_iso' => $this->has_iso,
            'is_emc' => $this->is_emc,
            'employee_count' => $this->employee_count,
            'annual_revenue' => $this->annual_revenue,
            'industry' => $this->industry ? new PrmIndustryResource($this->industry) : null,
            'industry_id' => $this->industry_id,
            'main_products' => $this->main_products,
            'service_id' => $this->service_id,
            'product_category_id' => $this->product_category_id,
            'production_capacity' => $this->production_capacity,
            'business_model' => $this->business_model,
            'certifications' => $this->certifications,
            'major_clients' => $this->major_clients,
            'activity_scope' => $this->activity_scope,
            'social_linkedin' => $this->social_linkedin,
            'social_instagram' => $this->social_instagram,
            'social_telegram' => $this->social_telegram,
            'social_whatsapp' => $this->social_whatsapp,
            'social_twitter' => $this->social_twitter,
            'social_facebook' => $this->social_facebook,
            'social_youtube' => $this->social_youtube,
            'social_aparat' => $this->social_aparat,
            'logo_path' => $this->logo_path,
            'cover_path' => $this->cover_path,
            'catalog_path' => $this->catalog_path,
            'resume_path' => $this->resume_path,
            'gallery_paths' => $this->gallery_paths,
            'cert_paths' => $this->cert_paths,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'gallery_images' => array_map(fn ($p) => Storage::url($p), $gallery),
            'cert_images' => array_map(fn ($p) => Storage::url($p), $certs),
            'catalog_file' => $catalogUrl,
            'resume_file' => $resumeUrl,
            'logo_url' => $logoUrl,
            'cover_url' => $coverUrl,
        ];
    }
}
