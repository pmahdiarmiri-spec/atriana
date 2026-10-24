<?php

namespace App\Http\Controllers\Api\PrmAdvertisements\User;

use App\Http\Controllers\Controller;
use App\Models\PrmCompany;
use App\Services\PrmAdvertisements\PrmAdvertisementCategories;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmAdvertisementMetaController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $company = PrmCompany::query()
            ->where('user_id', $user->id)
            ->first();

        return response()->json([
            'status' => 'success',
            'has_company' => $company !== null,
            'company' => $company ? [
                'id' => $company->id,
                'name_fa' => $company->name_fa,
                'name_en' => $company->name_en,
                'phone' => $company->phone,
                'province' => $company->province,
                'city' => $company->city,
                'address' => $company->address,
                'status' => $company->status?->value ?? $company->status,
            ] : null,
            'categories' => [
                'goods_fa' => PrmAdvertisementCategories::goodsFa(),
                'goods_en' => PrmAdvertisementCategories::goodsEn(),
                'services_fa' => PrmAdvertisementCategories::servicesFa(),
                'services_en' => PrmAdvertisementCategories::servicesEn(),
            ],
        ]);
    }
}
