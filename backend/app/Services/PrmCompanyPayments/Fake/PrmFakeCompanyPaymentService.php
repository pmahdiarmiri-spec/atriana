<?php

namespace App\Services\PrmCompanyPayments\Fake;

use Illuminate\Support\Str;

class PrmFakeCompanyPaymentService
{
    public function pay(int $amountRials): array
    {
        return [
            'payment_id' => (string) Str::uuid(),
            'amount_rials' => $amountRials,
            'status' => 'paid',
            'gateway' => 'fake',
            'paid_at' => now()->toIso8601String(),
        ];
    }
}
