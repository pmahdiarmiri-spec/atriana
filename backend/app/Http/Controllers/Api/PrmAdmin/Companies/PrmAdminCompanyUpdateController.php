<?php

namespace App\Http\Controllers\Api\PrmAdmin\Companies;

use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAdmin\Companies\PrmAdminCompanyUpdateReviewRequest;
use App\Models\PrmCompanyUpdate;
use App\Services\PrmAdmin\Companies\PrmAdminCompanyUpdateReviewService;
use Illuminate\Http\JsonResponse;

class PrmAdminCompanyUpdateController extends Controller
{
    public function __construct(
        private readonly PrmAdminCompanyUpdateReviewService $reviewService
    ) {
    }

    public function review(PrmAdminCompanyUpdateReviewRequest $request, PrmCompanyUpdate $updateRequest): JsonResponse
    {
        $reviewedRequest = $this->reviewService->review(
            $request->user(),
            $updateRequest,
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_company_update_reviewed',
            'data' => $reviewedRequest,
        ]);
    }
}
