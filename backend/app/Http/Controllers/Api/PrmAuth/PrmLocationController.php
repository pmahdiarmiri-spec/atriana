<?php

namespace App\Http\Controllers\Api\PrmAuth;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Country;
use App\Models\Province;
use Illuminate\Http\JsonResponse;

class PrmLocationController extends Controller
{
    public function countries(): JsonResponse
    {
        $countries = Country::query()
            ->select(['id', 'name_en', 'name_fa'])
            ->orderBy('name_en')
            ->get();

        return response()->json([
            'status' => 'success',
            'countries' => $countries,
        ]);
    }

    public function provinces(Country $country): JsonResponse
    {
        $provinces = Province::query()
            ->where('country_id', $country->id)
            ->select(['id', 'country_id', 'name_en', 'name_fa'])
            ->orderBy('name_en')
            ->get();

        return response()->json([
            'status' => 'success',
            'provinces' => $provinces,
        ]);
    }

    public function cities(Province $province): JsonResponse
    {
        $cities = City::query()
            ->where('province_id', $province->id)
            ->select(['id', 'province_id', 'name_en', 'name_fa'])
            ->orderBy('name_en')
            ->get();

        return response()->json([
            'status' => 'success',
            'cities' => $cities,
        ]);
    }
}
