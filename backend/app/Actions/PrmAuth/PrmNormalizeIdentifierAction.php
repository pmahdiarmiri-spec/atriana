<?php

namespace App\Actions\PrmAuth;

use App\Enums\PrmAuth\PrmVerificationChannel;
use RuntimeException;

class PrmNormalizeIdentifierAction
{
    public function execute(string $value): array
    {
        $cleaned = trim($value);

        if (filter_var($cleaned, FILTER_VALIDATE_EMAIL)) {
            return [
                'identifier' => strtolower($cleaned),
                'channel' => PrmVerificationChannel::EMAIL,
                'is_iran_mobile' => false,
            ];
        }

        $numeric = preg_replace('/[^\d\+]/', '', $cleaned);

        if (! is_string($numeric)) {
            throw new RuntimeException(
                'The provided identifier is not a valid email or phone number.'
            );
        }

        if (str_starts_with($numeric, '+98')) {
            $numeric = '0' . substr($numeric, 3);
        }

        if (str_starts_with($numeric, '0098')) {
            $numeric = '0' . substr($numeric, 4);
        }

        if (preg_match('/^9\d{9}$/', $numeric)) {
            $numeric = '0' . $numeric;
        }

        if (preg_match('/^09\d{9}$/', $numeric)) {
            return [
                'identifier' => $numeric,
                'channel' => PrmVerificationChannel::SMS,
                'is_iran_mobile' => true,
            ];
        }

        if (preg_match('/^\+?[1-9]\d{7,14}$/', $numeric)) {
            return [
                'identifier' => $numeric,
                'channel' => PrmVerificationChannel::SMS,
                'is_iran_mobile' => false,
            ];
        }

        throw new RuntimeException(
            'The provided identifier is not a valid email or phone number.'
        );
    }
}
