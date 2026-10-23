<?php

namespace App\Http\Controllers\Api\PrmCompanyPayments\User\MyCompanyPayment;

use App\Http\Controllers\Controller;
use App\Services\PrmCompanies\PrmCompanyRegistration\PrmCompanyRegistrationPriceService;
use Illuminate\Http\JsonResponse;

class PrmMyCompanyPaymentQuoteController extends Controller
{
    public function __construct(
        private readonly PrmCompanyRegistrationPriceService $priceService
    ) {
    }

    public function __invoke(): JsonResponse
    {
        $amount = $this->priceService->getRegistrationPriceRials();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_company_registration_quote_loaded',
            'amount_rials' => $amount,
        ]);
    }
}
