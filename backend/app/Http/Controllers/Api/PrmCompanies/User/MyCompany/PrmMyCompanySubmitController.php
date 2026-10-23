<?php

namespace App\Http\Controllers\Api\PrmCompanies\User\MyCompany;

use App\Http\Controllers\Controller;
use App\Http\Requests\PrmCompanySubmitRequest;
use App\Http\Resources\PrmCompanies\PrmCompanyResource;
use App\Models\PrmCompany;
use App\Services\PrmCompanies\PrmCompanyRegistration\PrmCompanySubmitService;
use Illuminate\Http\JsonResponse;

class PrmMyCompanySubmitController extends Controller
{
    public function __construct(
        private readonly PrmCompanySubmitService $submitService
    ) {
    }

    public function __invoke(PrmCompanySubmitRequest $request): JsonResponse
    {
        $user = $request->user();

        $company = PrmCompany::query()
            ->where('user_id', $user->id)
            ->first();

        if (!$company) {
            abort(422, 'ابتدا اطلاعات شرکت را ثبت کنید.');
        }

        $result = $this->submitService->submit($user, $company);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_my_company_submitted',
            'company' => new PrmCompanyResource($result['company']->load(['industry'])),
            'payment' => $result['payment'],
        ]);
    }
}
