<?php

namespace App\Http\Resources\PrmLocations;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrmCityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'province_id' => $this->province_id,
            'name_fa' => $this->name_fa,
            'name_en' => $this->name_en,
        ];
    }
}
