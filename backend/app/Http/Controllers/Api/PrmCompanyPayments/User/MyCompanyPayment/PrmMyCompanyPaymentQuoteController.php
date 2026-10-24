<?php

namespace App\Http\Controllers\Api\PrmCompanyPayments\User\MyCompanyPayment;

use App\Http\Controllers\Controller;
use App\Services\PrmCompanies\PrmCompanyRegistration\PrmCompanyRegistrationPriceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmMyCompanyPaymentQuoteController extends Controller
{
    public function __construct(
        private readonly PrmCompanyRegistrationPriceService $priceService
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $type = $request->query('type', 'registration');

        $amount = $type === 'renewal'
            ? $this->priceService->getRenewalPriceRials()
            : $this->priceService->getRegistrationPriceRials();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_company_payment_quote_loaded',
            'type' => $type,
            'amount_rials' => $amount,
        ]);
    }
}
