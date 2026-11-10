<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prm_conversations', function (Blueprint $table) {
            $table->string('moderation_status', 20)->default('active')->index();
            $table->timestamp('suspended_until')->nullable();
            $table->text('moderation_reason')->nullable();
            $table->foreignId('moderated_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamp('moderated_at')->nullable();
        });

        Schema::create('prm_chat_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('prm_conversations')->restrictOnDelete();
            $table->foreignId('reporter_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('reported_user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('message_id')->nullable()->constrained('prm_messages')->restrictOnDelete();
            $table->string('reason', 40);
            $table->text('details')->nullable();
            $table->string('status', 20)->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('resolution_note')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index(['reporter_id', 'conversation_id', 'status'], 'prm_chat_reports_lookup');
        });

        Schema::create('prm_chat_moderation_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('prm_conversations')->restrictOnDelete();
            $table->foreignId('admin_id')->constrained('users')->restrictOnDelete();
            $table->string('action', 20);
            $table->string('previous_status', 20);
            $table->string('new_status', 20);
            $table->text('reason');
            $table->timestamp('suspended_until')->nullable();
            $table->timestamp('created_at');

            $table->index(['conversation_id', 'created_at'], 'prm_chat_actions_history');
        });
    }

    public function down(): void
    {
        throw new \RuntimeException('Moderation records cannot be discarded by rollback.');
    }
};
