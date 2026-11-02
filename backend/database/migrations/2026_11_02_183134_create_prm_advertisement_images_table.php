<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prm_advertisement_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('advertisement_id')
                ->constrained('prm_advertisements')
                ->cascadeOnDelete();
            $table->string('path', 500);
            $table->unsignedSmallInteger('position')->default(0);
            $table->timestamps();
            $table->index(['advertisement_id', 'position']);
        });

        DB::table('prm_advertisements')
            ->whereNotNull('image_path')
            ->where('image_path', '<>', '')
            ->orderBy('id')
            ->chunkById(500, function ($advertisements): void {
                $timestamp = now();

                $rows = $advertisements->map(fn ($advertisement): array => [
                    'advertisement_id' => $advertisement->id,
                    'path' => $advertisement->image_path,
                    'position' => 0,
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ])->all();

                DB::table('prm_advertisement_images')->insert($rows);
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('prm_advertisement_images');
    }
};
