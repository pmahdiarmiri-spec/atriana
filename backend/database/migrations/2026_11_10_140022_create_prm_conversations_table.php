<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prm_conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('advertisement_id')->nullable()->constrained('prm_advertisements')->nullOnDelete();
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('recipient_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('last_message_at')->nullable()->index();
            $table->timestamps();

            $table->unique(['advertisement_id', 'creator_id', 'recipient_id'], 'prm_conv_ad_users_unique');
            $table->index(['creator_id', 'recipient_id']);
            $table->index(['recipient_id', 'creator_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prm_conversations');
    }
};
