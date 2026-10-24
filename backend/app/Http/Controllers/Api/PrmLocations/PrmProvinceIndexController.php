<?php

namespace App\Http\Controllers\Api\PrmLocations;

use App\Http\Controllers\Controller;
use App\Http\Resources\PrmLocations\PrmProvinceResource;
use App\Models\Province;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmProvinceIndexController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $countryId = $request->query('country_id');

        $query = Province::query()->orderBy('name_fa');

        if ($countryId) {
            $query->where('country_id', $countryId);
        }

        $provinces = $query->get();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_provinces_loaded',
            'provinces' => PrmProvinceResource::collection($provinces),
        ]);
    }
}
