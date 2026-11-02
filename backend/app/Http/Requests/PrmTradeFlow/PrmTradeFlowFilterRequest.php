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
            'tab' => ['nullable', 'string', 'in:tariffs,countries,customs,provinces,annual,monthly'],
            'page' => ['nullable', 'integer', 'min:1', 'max:100000'],
            'sort_by' => ['nullable', 'string', 'in:label,tariff_code,description,country,total_usd,total_rial,total_weight,record_count'],
            'sort_dir' => ['nullable', 'string', 'in:asc,desc'],
            'prefix' => ['nullable', 'string', 'regex:/^(?:[0-9]{2}|[0-9]{4}|[0-9]{6})$/'],
        ];
    }
}
