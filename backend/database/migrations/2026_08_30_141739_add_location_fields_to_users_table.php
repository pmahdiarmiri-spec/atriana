<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('country_id')->nullable()->after('trade_role')->constrained('countries')->nullOnDelete();
            $table->foreignId('province_id')->nullable()->after('country_id')->constrained('provinces')->nullOnDelete();
            $table->foreignId('city_id')->nullable()->after('province_id')->constrained('cities')->nullOnDelete();
            $table->string('custom_location', 190)->nullable()->after('city_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['country_id']);
            $table->dropForeign(['province_id']);
            $table->dropForeign(['city_id']);
            $table->dropColumn(['country_id', 'province_id', 'city_id', 'custom_location']);
        });
    }
};
