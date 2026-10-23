<?php

namespace App\Http\Controllers\Api\PrmCompanies\User\MyCompany;

use App\Http\Controllers\Controller;
use App\Http\Resources\PrmCompanies\PrmCompanyResource;
use App\Models\PrmCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmMyCompanyShowController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $company = PrmCompany::query()
            ->with(['industry'])
            ->where('user_id', $user->id)
            ->first();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_my_company_loaded',
            'company' => $company ? new PrmCompanyResource($company) : null,
        ]);
    }
}
