<?php

namespace App\Http\Requests\PrmAuth;

use App\Models\Country;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class PrmRegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $iranCountry = Country::query()
            ->where('name_en', 'Iran')
            ->orWhere('name_fa', 'ایران')
            ->first();

        $iranId = $iranCountry?->id;
        $isIran = (int) $this->input('country_id') === (int) $iranId;

        return [
            'identifier' => ['required', 'string', 'max:190'],
            'channel' => ['required', 'string', 'in:email,sms'],
            'verification_token' => ['required', 'string'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'trade_role' => ['required', 'string', 'in:exporter,importer,both'],
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'province_id' => [
                $isIran ? 'required' : 'nullable',
                'integer',
                Rule::exists('provinces', 'id')->where(function ($query) {
                    $query->where('country_id', $this->input('country_id'));
                }),
            ],
            'city_id' => [
                $isIran ? 'required' : 'nullable',
                'integer',
                Rule::exists('cities', 'id')->where(function ($query) {
                    $query->where('province_id', $this->input('province_id'));
                }),
            ],
            'custom_location' => [
                $isIran ? 'nullable' : 'nullable',
                'string',
                'max:190',
            ],
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)->letters()->mixedCase()->numbers(),
            ],
        ];
    }
}
