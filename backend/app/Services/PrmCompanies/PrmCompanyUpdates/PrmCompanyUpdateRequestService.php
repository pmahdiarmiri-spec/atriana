<?php

namespace App\Services\PrmCompanies\PrmCompanyUpdates;

use App\Enums\PrmCompanies\PrmCompanyStatus;
use App\Enums\PrmCompanies\PrmCompanyUpdateStatus;
use App\Models\PrmCompany;
use App\Models\PrmCompanyUpdate;
use App\Models\User;
use Illuminate\Support\Arr;

class PrmCompanyUpdateRequestService
{
    public function requestUpdate(User $user, PrmCompany $company, array $payload): PrmCompanyUpdate
    {
        if ($company->user_id !== $user->id) {
            abort(403, 'شما دسترسی لازم برای این عملیات را ندارید.');
        }

        if (!in_array($company->status, [PrmCompanyStatus::APPROVED], true)) {
            abort(422, 'فقط شرکت‌های تایید شده امکان ارسال درخواست به‌روزرسانی دارند.');
        }

        $allowedKeys = $company->getFillable();
        $newData = Arr::only($payload, $allowedKeys);

        $diff = [];
        foreach ($newData as $key => $value) {
            if ($company->{$key} !== $value) {
                $diff[$key] = $value;
            }
        }

        if (empty($diff)) {
            abort(422, 'تغییری در اطلاعات جهت ثبت یافت نشد.');
        }

        $pendingUpdate = PrmCompanyUpdate::query()
            ->where('company_id', $company->id)
            ->where('status', PrmCompanyUpdateStatus::PENDING)
            ->first();

        if ($pendingUpdate) {
            $existingData = $pendingUpdate->data ?? [];
            $mergedData = array_merge($existingData, $diff);
            $pendingUpdate->update(['data' => $mergedData]);
            return $pendingUpdate->refresh();
        }

        return PrmCompanyUpdate::create([
            'company_id' => $company->id,
            'status' => PrmCompanyUpdateStatus::PENDING,
            'data' => $diff,
        ]);
    }
}
