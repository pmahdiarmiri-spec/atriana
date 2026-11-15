<?php

use App\Enums\PrmCompanies\PrmCompanyUpdateStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prm_company_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('prm_companies')->cascadeOnDelete();
            $table->string('status', 32)->default(PrmCompanyUpdateStatus::PENDING->value);
            $table->json('data');
            $table->text('admin_message')->nullable();
            $table->timestamps();

            $table->index(['status']);
            $table->index(['company_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prm_company_updates');
    }
};
