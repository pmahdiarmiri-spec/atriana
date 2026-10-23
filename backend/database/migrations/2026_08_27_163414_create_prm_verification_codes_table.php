<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prm_verification_codes', function (Blueprint $table) {
            $table->id();
            $table->string('identifier', 190)->index();
            $table->enum('channel', ['email', 'sms']);
            $table->enum('purpose', ['registration', 'login', 'password_reset']);
            $table->string('code_hash');
            $table->string('token_hash')->nullable()->index();
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('expires_at')->index();
            $table->timestamp('verified_at')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prm_verification_codes');
    }
};
