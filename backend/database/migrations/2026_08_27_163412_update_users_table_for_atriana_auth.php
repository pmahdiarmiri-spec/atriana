<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->after('id')->nullable();
            $table->string('last_name')->after('first_name')->nullable();
            $table->string('mobile', 20)->after('email')->nullable()->unique();
            $table->enum('trade_role', ['exporter', 'importer', 'both'])->after('mobile')->default('both');
            $table->timestamp('mobile_verified_at')->after('email_verified_at')->nullable();
            $table->string('email')->nullable()->change();
            $table->string('password')->nullable()->change();
            $table->string('name')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['mobile']);
            $table->dropColumn([
                'first_name',
                'last_name',
                'mobile',
                'trade_role',
                'mobile_verified_at'
            ]);
            $table->string('email')->nullable(false)->change();
            $table->string('password')->nullable(false)->change();
            $table->string('name')->nullable(false)->change();
        });
    }
};
