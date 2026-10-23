<?php

use App\Enums\PrmCompanies\PrmCompanyStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prm_companies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('views_count')->default(0);
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('status', 32)->default(PrmCompanyStatus::DRAFT->value);
            $table->text('admin_message')->nullable();

            $table->string('name_fa', 191);
            $table->string('name_en', 191)->nullable();
            $table->string('slogan', 191)->nullable();
            $table->longText('description')->nullable();

            $table->string('email', 191)->nullable();
            $table->string('mobile', 32)->nullable();
            $table->string('country', 191)->nullable();
            $table->string('phone', 64)->nullable();
            $table->string('fax', 64)->nullable();
            $table->string('website', 191)->nullable();

            $table->string('province', 191)->nullable();
            $table->string('city', 191)->nullable();
            $table->string('address', 500)->nullable();
            $table->string('postal_code', 32)->nullable();

            $table->string('registration_number', 191)->nullable();
            $table->string('national_id', 191)->nullable();
            $table->string('economic_code', 191)->nullable();
            $table->unsignedSmallInteger('established_year')->nullable();

            $table->string('legal_structure', 191)->nullable();
            $table->string('ownership_type', 191)->nullable();

            $table->string('activity_type', 32)->nullable();

            $table->boolean('is_knowledge_based')->default(false);
            $table->boolean('is_creative')->default(false);
            $table->boolean('is_startup')->default(false);
            $table->boolean('is_exporter')->default(false);
            $table->boolean('has_iso')->default(false);
            $table->boolean('is_emc')->default(false);

            $table->string('employee_count', 191)->nullable();
            $table->string('annual_revenue', 191)->nullable();

            $table->foreignId('industry_id')->nullable()->constrained('prm_industries')->nullOnDelete();

            $table->string('main_products', 500)->nullable();

            $table->unsignedBigInteger('service_id')->nullable();
            $table->unsignedBigInteger('product_category_id')->nullable();

            $table->string('production_capacity', 191)->nullable();
            $table->string('business_model', 191)->nullable();
            $table->string('certifications', 500)->nullable();
            $table->string('major_clients', 500)->nullable();
            $table->string('activity_scope', 191)->nullable();

            $table->string('social_linkedin', 191)->nullable();
            $table->string('social_instagram', 191)->nullable();
            $table->string('social_telegram', 191)->nullable();
            $table->string('social_whatsapp', 191)->nullable();
            $table->string('social_twitter', 191)->nullable();
            $table->string('social_facebook', 191)->nullable();
            $table->string('social_youtube', 191)->nullable();
            $table->string('social_aparat', 191)->nullable();

            $table->string('logo_path', 500)->nullable();
            $table->string('cover_path', 500)->nullable();
            $table->string('catalog_path', 500)->nullable();
            $table->string('resume_path', 500)->nullable();
            $table->json('gallery_paths')->nullable();
            $table->json('cert_paths')->nullable();

            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();

            $table->timestamps();

            $table->unique(['user_id']);
            $table->index(['status']);
            $table->index(['industry_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prm_companies');
    }
};
