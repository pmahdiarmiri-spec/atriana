<?php

namespace App\Http\Controllers\Api\PrmCompanies\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PrmCompanies\PrmCompanyResource;
use App\Services\PrmCompanies\PrmPublicCompanies\PrmPublicCompanyDetailService;
use Illuminate\Http\JsonResponse;

class PrmPublicCompanyShowController extends Controller
{
    public function __construct(
        private readonly PrmPublicCompanyDetailService $detailService
    ) {
    }

    public function __invoke(int $company): JsonResponse
    {
        $companyModel = $this->detailService->getApprovedCompanyById($company);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_public_company_detail_loaded',
            'company' => new PrmCompanyResource($companyModel),
        ]);
    }
}
