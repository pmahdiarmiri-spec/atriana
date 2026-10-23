<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unique('email', 'prm_users_email_unique');
            $table->unique('mobile', 'prm_users_mobile_unique');
        });

        Schema::table('prm_verification_codes', function (Blueprint $table) {
            $table->index(
                ['identifier', 'purpose', 'verified_at', 'created_at'],
                'prm_verification_codes_auth_lookup_index'
            );

            $table->index(
                ['ip_address', 'created_at'],
                'prm_verification_codes_ip_rate_limit_index'
            );
        });
    }

    public function down(): void
    {
        Schema::table('prm_verification_codes', function (Blueprint $table) {
            $table->dropIndex(
                'prm_verification_codes_auth_lookup_index'
            );

            $table->dropIndex(
                'prm_verification_codes_ip_rate_limit_index'
            );
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('prm_users_email_unique');
            $table->dropUnique('prm_users_mobile_unique');
        });
    }
};
