<?php

namespace App\Http\Controllers\Api\PrmCompanies\User\Industries;

use App\Http\Controllers\Controller;
use App\Http\Resources\PrmCompanies\PrmIndustryResource;
use App\Models\PrmIndustry;
use Illuminate\Http\JsonResponse;

class PrmCompanyIndustryIndexController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $industries = PrmIndustry::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_industries_loaded',
            'industries' => PrmIndustryResource::collection($industries),
        ]);
    }
}
