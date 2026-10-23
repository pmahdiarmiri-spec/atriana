<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prm_verification_codes', function (Blueprint $table) {
            $table->enum('purpose', [
                'registration',
                'login',
                'password_reset',
                'email_verification',
            ])->change();
        });
    }

    public function down(): void
    {
        Schema::table('prm_verification_codes', function (Blueprint $table) {
            $table->enum('purpose', [
                'registration',
                'login',
                'password_reset',
            ])->change();
        });
    }
};
