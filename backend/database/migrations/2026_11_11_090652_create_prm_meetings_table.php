<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prm_meetings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('creator_id')->constrained('users');
            $table->string('code', 10)->unique();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->integer('max_participants')->default(15);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prm_meetings');
    }
};
