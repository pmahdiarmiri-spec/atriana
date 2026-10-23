<?php

namespace App\Http\Controllers\Api\PrmCompanyPayments\User\MyCompanyPayment;

use App\Http\Controllers\Controller;
use App\Services\PrmCompanies\PrmCompanyRegistration\PrmCompanyRegistrationPriceService;
use App\Services\PrmCompanyPayments\Fake\PrmFakeCompanyPaymentService;
use Illuminate\Http\JsonResponse;

class PrmMyCompanyPaymentPayFakeController extends Controller
{
    public function __construct(
        private readonly PrmCompanyRegistrationPriceService $priceService,
        private readonly PrmFakeCompanyPaymentService $fakePaymentService
    ) {
    }

    public function __invoke(): JsonResponse
    {
        $amount = $this->priceService->getRegistrationPriceRials();
        $payment = $this->fakePaymentService->pay($amount);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_company_fake_payment_paid',
            'payment' => $payment,
        ]);
    }
}
