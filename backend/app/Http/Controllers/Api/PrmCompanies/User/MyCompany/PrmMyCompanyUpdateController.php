<?php

namespace App\Http\Controllers\Api\PrmCompanies\User\MyCompany;

use App\Http\Controllers\Controller;
use App\Http\Requests\PrmCompanyStoreRequest;
use App\Models\PrmCompany;
use App\Services\PrmCompanies\PrmCompanyUpdates\PrmCompanyUpdateRequestService;
use Illuminate\Http\JsonResponse;

class PrmMyCompanyUpdateController extends Controller
{
    public function __construct(
        private readonly PrmCompanyUpdateRequestService $updateRequestService
    ) {
    }

    public function __invoke(PrmCompanyStoreRequest $request): JsonResponse
    {
        $user = $request->user();

        $company = PrmCompany::query()
            ->where('user_id', $user->id)
            ->first();

        if (!$company) {
            abort(404, 'شرکتی یافت نشد.');
        }

        $updateRequest = $this->updateRequestService->requestUpdate(
            $user,
            $company,
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'code' => 'prm_my_company_update_requested',
            'update_request_id' => $updateRequest->id,
        ]);
    }
}
