<?php

namespace App\Http\Resources\PrmCompanies;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrmIndustryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_fa' => $this->name_fa,
            'name_en' => $this->name_en,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
