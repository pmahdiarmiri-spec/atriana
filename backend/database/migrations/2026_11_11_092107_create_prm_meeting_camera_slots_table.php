<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prm_meeting_camera_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained('prm_meetings')->cascadeOnDelete();
            $table->unsignedTinyInteger('slot');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->unique(['meeting_id', 'slot']);
            $table->unique(['meeting_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prm_meeting_camera_slots');
    }
};
