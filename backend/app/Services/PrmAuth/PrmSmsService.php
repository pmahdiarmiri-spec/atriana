<?php

namespace App\Services\PrmAuth;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class PrmSmsService
{
    public function sendVerificationCode(string $mobile, string $code): bool
    {
        $username = config('services.payamak.username');
        $password = config('services.payamak.password');
        $patternId = config('services.payamak.pattern_id');
        $url = config('services.payamak.api_url');

        if (! $username || ! $password || ! $patternId || ! $url) {
            throw new RuntimeException('SMS configuration error.');
        }

        $formattedMobile = preg_replace('/^\+98/', '0', $mobile);
        $formattedMobile = preg_replace('/^0098/', '0', $formattedMobile);

        if (! is_string($formattedMobile)) {
            throw new RuntimeException('SMS recipient format error.');
        }

        try {
            $response = Http::asForm()
                ->timeout(15)
                ->retry(2, 300)
                ->post($url, [
                    'username' => $username,
                    'password' => $password,
                    'text' => $code,
                    'to' => $formattedMobile,
                    'bodyId' => (int) $patternId,
                ]);

            $responseData = $response->json();
            $retStatus = (int) data_get($responseData, 'RetStatus');

            Log::info('Prm SMS delivery result', [
                'http_status' => $response->status(),
                'ret_status' => $retStatus,
            ]);

            if (! $response->successful()) {
                throw new RuntimeException('SMS gateway transport error.');
            }

            if ($retStatus !== 0 && $retStatus !== 1) {
                throw new RuntimeException('SMS gateway delivery error.');
            }

            return true;
        } catch (Throwable $exception) {
            Log::warning('Prm SMS delivery failed', [
                'exception' => $exception::class,
            ]);

            throw new RuntimeException('SMS delivery failed.');
        }
    }
}
