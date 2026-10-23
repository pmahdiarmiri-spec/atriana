<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prm_plans', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name_fa');
            $table->string('name_en');
            $table->text('description_fa')->nullable();
            $table->text('description_en')->nullable();
            $table->decimal('price', 15, 2)->unsigned()->default(0);
            $table->string('currency', 10)->default('USD');
            $table->string('interval')->default('monthly');
            $table->json('features')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prm_plans');
    }
};
