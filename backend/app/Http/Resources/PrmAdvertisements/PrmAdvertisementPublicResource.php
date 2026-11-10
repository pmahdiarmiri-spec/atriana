<?php

namespace App\Http\Resources\PrmAdvertisements;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PrmAdvertisementPublicResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $images = $this->relationLoaded('images')
            ? $this->images->map(fn ($image): array => [
                'id' => $image->id,
                'url' => Storage::disk('public')->url($image->path),
                'position' => $image->position,
                'is_primary' => $image->path === $this->image_path,
            ])->values()->all()
            : [];

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'type' => $this->type?->value ?? $this->type,
            'origin' => $this->origin?->value ?? $this->origin,
            'nature' => $this->nature?->value ?? $this->nature,
            'category' => $this->category,
            'sub_category' => $this->sub_category,
            'title' => $this->title,
            'title_en' => $this->title_en,
            'image_url' => $this->image_path ? Storage::disk('public')->url($this->image_path) : null,
            'images' => $images,
            'province' => $this->province,
            'city' => $this->city,
            'description' => $this->description,
            'price_type' => $this->price_type?->value ?? $this->price_type,
            'price' => $this->price,
            'currency' => $this->currency,
            'moq' => $this->moq,
            'moq_unit' => $this->moq_unit,
            'company_name' => $this->company_name,
            'has_verified_badge' => (bool) $this->has_verified_badge,
            'is_laddered' => (bool) $this->is_laddered,
            'views' => (int) $this->views,
            'phone' => $this->show_phone ? $this->phone : null,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
