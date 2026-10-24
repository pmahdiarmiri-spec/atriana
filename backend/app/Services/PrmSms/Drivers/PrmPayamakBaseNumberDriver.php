<?php

namespace App\Services\PrmSms\Drivers;

use App\Services\PrmSms\Contracts\PrmSmsDriverInterface;
use App\Services\PrmSms\DTO\PrmSmsPayloadDto;
use App\Services\PrmSms\DTO\PrmSmsResultDto;
use Illuminate\Support\Facades\Http;

class PrmPayamakBaseNumberDriver implements PrmSmsDriverInterface
{
    private string $username;
    private string $password;
    private string $apiUrl;
    private string $from;

    public function __construct()
    {
        $this->username = (string) config('services.payamak.username');
        $this->password = (string) config('services.payamak.password');
        $this->apiUrl = (string) config('services.payamak.api_url');
        $this->from = (string) config('services.payamak.from');
    }

    public function send(PrmSmsPayloadDto $payload): PrmSmsResultDto
    {
        $response = Http::asJson()
            ->acceptJson()
            ->timeout(20)
            ->post($this->apiUrl, [
                'username' => $this->username,
                'password' => $this->password,
                'to' => $payload->getTo(),
                'from' => $this->from,
                'text' => $payload->getText(),
                'isFlash' => false,
            ]);

        if (! $response->successful()) {
            return new PrmSmsResultDto(
                false,
                null,
                'HTTP_' . $response->status(),
                'HTTP_REQUEST_FAILED'
            );
        }

        $data = $response->json();

        if (! is_array($data) || ! array_key_exists('Value', $data)) {
            return new PrmSmsResultDto(
                false,
                null,
                'INVALID_RESPONSE',
                'PAYAMAK_INVALID_RESPONSE'
            );
        }

        $value = (string) $data['Value'];
        $retStatus = (int) ($data['RetStatus'] ?? 0);

        if ($retStatus === 1 && $this->isValidRecId($value)) {
            return new PrmSmsResultDto(true, $value, null, null);
        }

        return new PrmSmsResultDto(
            false,
            null,
            $value,
            $this->resolveErrorMessage($value)
        );
    }

    private function isValidRecId(string $value): bool
    {
        return is_numeric($value)
            && strlen($value) >= 8
            && ! str_starts_with($value, '-');
    }

    private function resolveErrorMessage(string $code): string
    {
        return match ($code) {
            '-111' => 'INVALID_REQUEST_IP',
            '-110' => 'API_KEY_REQUIRED_INSTEAD_OF_PASSWORD',
            '-109' => 'ALLOWED_IP_NOT_CONFIGURED',
            '-108' => 'IP_BLOCKED',
            '-6' => 'INTERNAL_SYSTEM_ERROR_OR_DATA_MISMATCH',
            '0' => 'INVALID_CREDENTIALS',
            '2' => 'INSUFFICIENT_CREDIT',
            '3' => 'DAILY_SEND_LIMIT',
            '4' => 'VOLUME_SEND_LIMIT',
            '5' => 'INVALID_SENDER_NUMBER',
            '6' => 'GATEWAY_UPDATING',
            '7' => 'FILTERED_WORDS_DETECTED',
            '9' => 'PUBLIC_LINE_WEBSERVICE_NOT_ALLOWED',
            '10' => 'USER_INACTIVE',
            '11' => 'NOT_SENT',
            '12' => 'DOCUMENTS_INCOMPLETE',
            '14' => 'TEXT_CONTAINS_LINK',
            '15' => 'MISSING_ADVERTISEMENT_SUFFIX',
            '16' => 'RECIPIENT_NOT_FOUND',
            '17' => 'EMPTY_TEXT',
            '18' => 'INVALID_MOBILE_NUMBER',
            default => 'PAYAMAK_ERROR_' . $code,
        };
    }
}
