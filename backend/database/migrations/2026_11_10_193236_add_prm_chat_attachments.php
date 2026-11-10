<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prm_messages', function (Blueprint $table) {
            $table->text('body')->nullable()->change();
        });

        Schema::create('prm_message_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('message_id')->unique()->constrained('prm_messages')->restrictOnDelete();
            $table->string('kind', 16);
            $table->string('disk', 16);
            $table->string('path');
            $table->string('name');
            $table->string('mime', 100);
            $table->unsignedBigInteger('size');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        throw new \RuntimeException('Chat history schema rollback is not supported.');
    }
};
