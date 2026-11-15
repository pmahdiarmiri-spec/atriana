<?php

namespace App\Services\PrmAdmin\Companies;

use App\Enums\PrmCompanies\PrmCompanyStatus;
use App\Enums\PrmCompanies\PrmCompanyUpdateStatus;
use App\Models\PrmCompanyUpdate;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PrmAdminCompanyUpdateReviewService
{
    public function review(User $admin, PrmCompanyUpdate $updateRequest, array $payload): PrmCompanyUpdate
    {
        if ($updateRequest->status !== PrmCompanyUpdateStatus::PENDING) {
            abort(422, 'این درخواست قبلاً بررسی شده است.');
        }

        return DB::transaction(function () use ($updateRequest, $payload) {
            $status = PrmCompanyUpdateStatus::from($payload['status']);
            $adminMessage = $payload['admin_message'] ?? null;

            $updateRequest->status = $status;
            $updateRequest->admin_message = $adminMessage;
            $updateRequest->save();

            $company = $updateRequest->company;

            if ($status === PrmCompanyUpdateStatus::APPROVED) {
                $updateData = is_array($updateRequest->data) ? $updateRequest->data : [];
                $company->fill($updateData);
                $company->status = PrmCompanyStatus::APPROVED;
                $company->approved_at = now();
                $company->rejected_at = null;
            } elseif ($status === PrmCompanyUpdateStatus::NEEDS_EDIT) {
                $company->status = PrmCompanyStatus::NEEDS_EDIT;
            } elseif ($status === PrmCompanyUpdateStatus::REJECTED) {
                $company->status = PrmCompanyStatus::REJECTED;
                $company->rejected_at = now();
            }

            $company->admin_message = $adminMessage;
            $company->save();

            return $updateRequest->refresh();
        });
    }
}
