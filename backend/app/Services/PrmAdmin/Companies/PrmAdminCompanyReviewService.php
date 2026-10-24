<?php

namespace App\Services\PrmAdmin\Companies;

use App\Enums\PrmCompanies\PrmCompanyStatus;
use App\Models\PrmAdminAuditLog;
use App\Models\PrmCompany;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PrmAdminCompanyReviewService
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = PrmCompany::query()
            ->with(['industry', 'user'])
            ->latest('updated_at');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name_fa', 'like', "%{$search}%")
                    ->orWhere('name_en', 'like', "%{$search}%")
                    ->orWhere('national_id', 'like', "%{$search}%")
                    ->orWhere('registration_number', 'like', "%{$search}%")
                    ->orWhere('economic_code', 'like', "%{$search}%");
            });
        }

        return $query->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function review(User $admin, PrmCompany $company, array $data): PrmCompany
    {
        return DB::transaction(function () use ($admin, $company, $data) {
            $previousStatus = $company->status;
            $newStatus = PrmCompanyStatus::from($data['status']);

            $company->status = $newStatus;
            $company->admin_message = $data['admin_message'] ?? null;

            if ($newStatus === PrmCompanyStatus::APPROVED) {
                $company->approved_at = now();
                $company->rejected_at = null;
            } elseif ($newStatus === PrmCompanyStatus::REJECTED) {
                $company->rejected_at = now();
            }

            $company->save();

            PrmAdminAuditLog::query()->create([
                'user_id' => $admin->id,
                'action' => 'admin_company_status_updated',
                'target_type' => PrmCompany::class,
                'target_id' => $company->id,
                'payload' => [
                    'previous_status' => $previousStatus instanceof PrmCompanyStatus ? $previousStatus->value : $previousStatus,
                    'new_status' => $newStatus->value,
                    'admin_message' => $data['admin_message'] ?? null,
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $company->fresh(['industry', 'user']);
        });
    }
}
