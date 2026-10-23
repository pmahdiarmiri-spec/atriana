<?php

namespace App\Services\PrmCompanies\PrmCompanyRegistration;

use App\Enums\PrmCompanies\PrmCompanyStatus;
use App\Models\PrmCompany;
use App\Models\User;
use Illuminate\Support\Arr;

class PrmCompanyDraftUpsertService
{
    public function upsertDraft(User $user, array $payload): PrmCompany
    {
        $allowedKeys = (new PrmCompany())->getFillable();
        $data = Arr::only($payload, $allowedKeys);

        $company = PrmCompany::query()->firstOrNew(['user_id' => $user->id]);

        if ($company->exists) {
            if (!in_array($company->status, [PrmCompanyStatus::DRAFT, PrmCompanyStatus::NEEDS_EDIT], true)) {
                abort(422, 'امکان ویرایش در این وضعیت وجود ندارد.');
            }
        }

        $company->fill($data);

        if (!$company->exists) {
            $company->status = PrmCompanyStatus::DRAFT;
        }

        $company->save();

        return $company->refresh();
    }
}
