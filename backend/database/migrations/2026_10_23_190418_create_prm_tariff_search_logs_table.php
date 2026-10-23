<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prm_tariff_search_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('query', 512)->nullable()->index();
            $table->json('filters')->nullable();
            $table->unsignedInteger('result_count')->default(0);
            $table->unsignedInteger('duration_ms')->default(0);
            $table->string('ip', 64)->nullable()->index();
            $table->string('user_agent', 512)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prm_tariff_search_logs');
    }
};
