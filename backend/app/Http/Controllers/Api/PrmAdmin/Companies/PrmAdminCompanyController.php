<?php

namespace App\Http\Controllers\Api\PrmAdmin\Companies;

use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAdmin\Companies\PrmAdminCompanyReviewRequest;
use App\Http\Resources\PrmCompanies\PrmCompanyResource;
use App\Models\PrmCompany;
use App\Services\PrmAdmin\Companies\PrmAdminCompanyReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmAdminCompanyController extends Controller
{
    public function __construct(
        private readonly PrmAdminCompanyReviewService $reviewService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $companies = $this->reviewService->paginate($request->only(['status', 'search', 'per_page']));

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_companies_fetched',
            'data' => $companies,
        ]);
    }

    public function show(PrmCompany $company): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_company_details_loaded',
            'company' => new PrmCompanyResource($company->load(['industry', 'user'])),
        ]);
    }

    public function review(PrmAdminCompanyReviewRequest $request, PrmCompany $company): JsonResponse
    {
        $updatedCompany = $this->reviewService->review(
            $request->user(),
            $company,
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_company_status_updated',
            'company' => new PrmCompanyResource($updatedCompany),
        ]);
    }
}
