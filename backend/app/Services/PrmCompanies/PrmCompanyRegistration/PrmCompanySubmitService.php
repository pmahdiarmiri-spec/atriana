<?php

namespace App\Services\PrmCompanies\PrmCompanyRegistration;

use App\Enums\PrmCompanies\PrmCompanyStatus;
use App\Models\PrmCompany;
use App\Models\User;
use App\Services\PrmCompanyPayments\Fake\PrmFakeCompanyPaymentService;
use Illuminate\Support\Facades\DB;

class PrmCompanySubmitService
{
    public function __construct(
        private readonly PrmCompanyRegistrationPriceService $priceService,
        private readonly PrmFakeCompanyPaymentService $fakePaymentService
    ) {
    }

    public function submit(User $user, PrmCompany $company): array
    {
        if (!in_array($company->status, [PrmCompanyStatus::DRAFT, PrmCompanyStatus::NEEDS_EDIT], true)) {
            abort(422, 'امکان ارسال برای بررسی در این وضعیت وجود ندارد.');
        }

        if (!$company->name_fa) {
            abort(422, 'نام فارسی شرکت الزامی است.');
        }

        $amount = $this->priceService->getRegistrationPriceRials();

        return DB::transaction(function () use ($company, $amount) {
            $payment = $this->fakePaymentService->pay($amount);

            $company->status = PrmCompanyStatus::PENDING;
            $company->submitted_at = now();
            $company->expires_at = now()->addYear();
            $company->save();

            return [
                'company' => $company->refresh(),
                'payment' => $payment,
            ];
        });
    }
}
