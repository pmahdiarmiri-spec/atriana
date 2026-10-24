<?php

namespace App\Http\Resources\PrmLocations;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrmProvinceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'country_id' => $this->country_id,
            'name_fa' => $this->name_fa,
            'name_en' => $this->name_en,
        ];
    }
}
