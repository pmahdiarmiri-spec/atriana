<?php

namespace App\Http\Requests\PrmTradeFlow;

use Illuminate\Foundation\Http\FormRequest;

class PrmTradeFlowFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'trade_type' => ['nullable', 'string', 'in:all,import,export'],
            'year' => ['nullable', 'integer'],
            'month' => ['nullable', 'integer', 'between:1,12'],
            'continent_id' => ['nullable', 'integer'],
            'country_id' => ['nullable', 'integer'],
            'province_id' => ['nullable', 'integer'],
            'custom_id' => ['nullable', 'integer'],
            'tariff' => ['nullable', 'string', 'max:255'],
            'region_id' => ['nullable', 'integer'],
            'united_id' => ['nullable', 'integer'],
            'section_id' => ['nullable', 'integer'],
            'season' => ['nullable', 'string', 'max:50'],
            'metric' => ['nullable', 'string', 'in:dolar,rial,weight'],
        ];
    }
}
