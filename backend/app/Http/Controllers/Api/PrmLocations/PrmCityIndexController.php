<?php

namespace App\Http\Controllers\Api\PrmLocations;

use App\Http\Controllers\Controller;
use App\Http\Resources\PrmLocations\PrmCityResource;
use App\Models\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmCityIndexController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $provinceId = $request->query('province_id');

        $query = City::query()->orderBy('name_fa');

        if ($provinceId) {
            $query->where('province_id', $provinceId);
        }

        $cities = $query->get();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_cities_loaded',
            'cities' => PrmCityResource::collection($cities),
        ]);
    }
}
