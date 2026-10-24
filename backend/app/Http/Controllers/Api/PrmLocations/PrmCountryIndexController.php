<?php

namespace App\Http\Controllers\Api\PrmLocations;

use App\Http\Controllers\Controller;
use App\Http\Resources\PrmLocations\PrmCountryResource;
use App\Models\Country;
use Illuminate\Http\JsonResponse;

class PrmCountryIndexController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $countries = Country::query()
            ->orderBy('name_fa')
            ->get();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_countries_loaded',
            'countries' => PrmCountryResource::collection($countries),
        ]);
    }
}
