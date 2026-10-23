<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tariff_data', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code_raw', 32)->index();
            $table->string('code_formatted', 32)->index();
            $table->string('chapter', 128)->nullable()->index();
            $table->string('section', 128)->nullable()->index();
            $table->string('description', 512)->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tariff_data');
    }
};
