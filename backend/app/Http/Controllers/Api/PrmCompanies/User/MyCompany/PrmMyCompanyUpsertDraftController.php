<?php

namespace App\Http\Controllers\Api\PrmCompanies\User\MyCompany;

use App\Http\Controllers\Controller;
use App\Http\Requests\PrmCompanyUpdateDraftRequest;
use App\Http\Resources\PrmCompanies\PrmCompanyResource;
use App\Services\PrmCompanies\PrmCompanyRegistration\PrmCompanyDraftUpsertService;
use Illuminate\Http\JsonResponse;

class PrmMyCompanyUpsertDraftController extends Controller
{
    public function __construct(
        private readonly PrmCompanyDraftUpsertService $draftUpsertService
    ) {
    }

    public function __invoke(PrmCompanyUpdateDraftRequest $request): JsonResponse
    {
        $company = $this->draftUpsertService->upsertDraft(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'code' => 'prm_my_company_draft_saved',
            'company' => new PrmCompanyResource($company->load(['industry'])),
        ]);
    }
}
