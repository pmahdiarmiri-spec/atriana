<?php

namespace App\Http\Controllers\Api\PrmCompanies\User\MyCompany;

use App\Http\Controllers\Controller;
use App\Http\Requests\PrmCompanySubmitRequest;
use App\Http\Resources\PrmCompanies\PrmCompanyResource;
use App\Models\PrmCompany;
use App\Services\PrmCompanies\PrmCompanyRegistration\PrmCompanyRenewalService;
use Illuminate\Http\JsonResponse;

class PrmMyCompanyRenewController extends Controller
{
    public function __construct(
        private readonly PrmCompanyRenewalService $renewalService
    ) {
    }

    public function __invoke(PrmCompanySubmitRequest $request): JsonResponse
    {
        $user = $request->user();

        $company = PrmCompany::query()
            ->where('user_id', $user->id)
            ->first();

        if (!$company) {
            abort(422, 'شرکتی جهت تمدید یافت نشد.');
        }

        $result = $this->renewalService->renew($user, $company);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_my_company_renewed',
            'company' => new PrmCompanyResource($result['company']->load(['industry'])),
            'payment' => $result['payment'],
        ]);
    }
}
