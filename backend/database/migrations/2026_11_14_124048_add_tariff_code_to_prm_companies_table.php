<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prm_companies', function (Blueprint $table) {
            $table->string('tariff_code')->nullable()->after('economic_code');
        });
    }

    public function down(): void
    {
        Schema::table('prm_companies', function (Blueprint $table) {
            $table->dropColumn('tariff_code');
        });
    }
};
