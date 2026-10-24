<?php

namespace App\Http\Controllers\Api\PrmAdvertisements\User;

use App\Enums\PrmAdvertisements\PrmAdvertisementStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAdvertisements\PrmStoreAdvertisementRequest;
use App\Http\Resources\PrmAdvertisements\PrmAdvertisementResource;
use App\Models\PrmAdvertisement;
use App\Models\PrmCompany;
use Illuminate\Http\JsonResponse;

class PrmAdvertisementStoreController extends Controller
{
    public function __invoke(PrmStoreAdvertisementRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $company = PrmCompany::query()
            ->where('user_id', $user->id)
            ->first();

        $useCompany = (bool) ($validated['use_company_profile'] ?? false);
        $companyId = null;

        if ($useCompany) {
            if (!$company) {
                return response()->json([
                    'status' => 'error',
                    'code' => 'prm_company_not_registered',
                    'message' => 'پروفایل شرکتی شما ثبت نشده است. ابتدا شرکت خود را ثبت کنید یا این گزینه را غیرفعال نمایید.',
                ], 422);
            }
            $companyId = $company->id;
            $validated['company_name'] = $company->name_fa ?: $company->name_en;
            if (empty($validated['phone']) && !empty($company->phone)) {
                $validated['phone'] = $company->phone;
            }
            if (empty($validated['province']) && !empty($company->province)) {
                $validated['province'] = $company->province;
            }
            if (empty($validated['city']) && !empty($company->city)) {
                $validated['city'] = $company->city;
            }
            if (empty($validated['address']) && !empty($company->address)) {
                $validated['address'] = $company->address;
            }
        }

        $validated['user_id'] = $user->id;
        $validated['company_id'] = $companyId;
        $validated['use_company_profile'] = $useCompany;
        $validated['slug'] = PrmAdvertisement::generateUniqueSlug($validated['title']);
        $validated['status'] = PrmAdvertisementStatus::PENDING->value;
        $validated['payment_status'] = 'free';
        $validated['views'] = 0;
        $validated['has_verified_badge'] = false;
        $validated['is_laddered'] = false;

        $advertisement = PrmAdvertisement::create($validated);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_advertisement_created',
            'message' => 'آگهی با موفقیت ثبت شد و پس از بررسی منتشر خواهد شد.',
            'advertisement' => new PrmAdvertisementResource($advertisement),
        ], 201);
    }
}
