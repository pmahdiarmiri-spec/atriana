<?php

namespace App\Services\PrmAdmin\Companies;

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
            $updateRequest->status = $status;
            $updateRequest->admin_message = $payload['admin_message'] ?? null;
            $updateRequest->save();

            if ($status === PrmCompanyUpdateStatus::APPROVED) {
                $company = $updateRequest->company;
                $company->update($updateRequest->data);
            }

            return $updateRequest->refresh();
        });
    }
}
