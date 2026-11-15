<?php

namespace App\Http\Controllers\Api\PrmAdmin\Companies;

use App\Enums\PrmCompanies\PrmCompanyUpdateStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAdmin\Companies\PrmAdminCompanyReviewRequest;
use App\Http\Resources\PrmCompanies\PrmCompanyResource;
use App\Models\PrmCompany;
use App\Models\PrmCompanyUpdate;
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
        $company->load(['industry', 'user']);

        $pendingUpdate = PrmCompanyUpdate::where('company_id', $company->id)
            ->where('status', PrmCompanyUpdateStatus::PENDING)
            ->latest()
            ->first();

        $resource = (new PrmCompanyResource($company))->toArray(request());
        
        $resource['has_update_request'] = (bool) $pendingUpdate;
        $resource['pending_update_data'] = $pendingUpdate ? $pendingUpdate->data : null;

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_company_details_loaded',
            'company' => $resource,
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
