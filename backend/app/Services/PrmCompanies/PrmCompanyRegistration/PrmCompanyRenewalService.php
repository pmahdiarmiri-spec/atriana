<?php

namespace App\Services\PrmCompanies\PrmCompanyRegistration;

use App\Enums\PrmCompanies\PrmCompanyStatus;
use App\Models\PrmCompany;
use App\Models\User;
use App\Services\PrmCompanyPayments\Fake\PrmFakeCompanyPaymentService;
use Illuminate\Support\Facades\DB;

class PrmCompanyRenewalService
{
    public function __construct(
        private readonly PrmCompanyRegistrationPriceService $priceService,
        private readonly PrmFakeCompanyPaymentService $fakePaymentService
    ) {
    }

    public function renew(User $user, PrmCompany $company): array
    {
        if ($company->user_id !== $user->id) {
            abort(403, 'شما دسترسی لازم برای تمدید این شرکت را ندارید.');
        }

        if (!in_array($company->status, [PrmCompanyStatus::APPROVED, PrmCompanyStatus::EXPIRED], true)) {
            abort(422, 'فقط شرکت‌های تایید شده امکان تمدید دارند.');
        }

        $amount = $this->priceService->getRenewalPriceRials();

        return DB::transaction(function () use ($company, $amount) {
            $payment = $this->fakePaymentService->pay($amount);

            $baseDate = ($company->expires_at && $company->expires_at->isFuture())
                ? $company->expires_at
                : now();

            $company->expires_at = $baseDate->copy()->addYear();
            $company->status = PrmCompanyStatus::APPROVED;
            $company->save();

            return [
                'company' => $company->refresh(),
                'payment' => $payment,
            ];
        });
    }
}
