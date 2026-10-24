<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prm_advertisements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('prm_companies')->nullOnDelete();
            $table->boolean('use_company_profile')->default(false);

            $table->string('locale', 10)->default('fa');
            $table->string('type', 32)->default('offer');
            $table->string('origin', 32)->default('domestic');
            $table->string('nature', 32)->default('goods');
            $table->string('category', 191);
            $table->string('sub_category', 191)->nullable();

            $table->string('title', 255);
            $table->string('title_en', 255)->nullable();
            $table->string('slug', 255)->unique();

            $table->string('province', 191)->nullable();
            $table->string('city', 191)->nullable();
            $table->text('address')->nullable();

            $table->longText('description');
            $table->longText('description_en')->nullable();

            $table->string('price_type', 32)->default('fixed');
            $table->decimal('price', 18, 2)->nullable();
            $table->string('currency', 32)->default('toman');

            $table->decimal('moq', 14, 2)->nullable();
            $table->string('moq_unit', 64)->nullable();

            $table->string('delivery_time', 128)->nullable();
            $table->string('delivery_type', 128)->nullable();
            $table->string('payment_terms', 128)->nullable();
            $table->string('quality_grade', 64)->nullable();
            $table->string('video_link', 500)->nullable();

            $table->string('company_name', 191)->nullable();
            $table->string('business_type', 128)->nullable();
            $table->string('activity_type', 128)->nullable();
            $table->string('experience', 128)->nullable();
            $table->text('licenses')->nullable();

            $table->string('phone', 64)->nullable();
            $table->boolean('show_phone')->default(true);

            $table->string('status', 32)->default('pending');
            $table->text('admin_note')->nullable();
            $table->string('payment_status', 32)->default('free');

            $table->boolean('request_verified_badge')->default(false);
            $table->boolean('has_verified_badge')->default(false);
            $table->boolean('is_laddered')->default(false);
            $table->boolean('request_ladder')->default(false);
            $table->unsignedBigInteger('views')->default(0);

            $table->string('hr_full_name', 191)->nullable();
            $table->string('hr_national_code', 32)->nullable();
            $table->string('hr_email', 191)->nullable();
            $table->string('hr_job_title', 191)->nullable();
            $table->string('hr_gender', 32)->nullable();
            $table->unsignedInteger('hr_count')->nullable();
            $table->string('hr_age_range', 64)->nullable();
            $table->string('hr_salary', 128)->nullable();
            $table->string('hr_work_area', 191)->nullable();
            $table->string('hr_work_hours', 128)->nullable();
            $table->string('hr_education', 128)->nullable();
            $table->string('hr_study_field', 191)->nullable();
            $table->text('hr_skills_desc')->nullable();

            $table->string('applicant_full_name', 191)->nullable();
            $table->string('applicant_national_code', 32)->nullable();
            $table->date('applicant_birth_date')->nullable();
            $table->string('applicant_education', 128)->nullable();
            $table->string('applicant_study_field', 191)->nullable();
            $table->string('applicant_marital_status', 32)->nullable();
            $table->string('applicant_military_service', 64)->nullable();
            $table->string('applicant_employment_type', 64)->nullable();
            $table->string('applicant_preferred_companies', 255)->nullable();
            $table->text('applicant_postal_address')->nullable();
            $table->string('applicant_mobile', 32)->nullable();
            $table->string('applicant_phone', 64)->nullable();
            $table->string('applicant_email', 191)->nullable();
            $table->text('applicant_skills_experience')->nullable();
            $table->string('applicant_resume_path', 500)->nullable();
            $table->boolean('applicant_terms_accepted')->default(false);

            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['nature', 'category']);
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prm_advertisements');
    }
};
