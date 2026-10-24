<?php

namespace App\Services\PrmAuth;

use App\Enums\PrmAuth\PrmVerificationChannel;
use App\Enums\PrmAuth\PrmVerificationPurpose;
use App\Exceptions\PrmAuth\PrmAuthException;
use App\Models\PrmVerificationCode;
use App\Services\PrmNotifications\Channels\PrmAuthSmsNotificationService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Throwable;

class PrmVerificationCodeService
{
    public function __construct(
        protected PrmAuthSmsNotificationService $smsNotification,
        protected PrmEmailVerificationService $emailService
    ) {
    }

    public function generateAndSend(
        string $identifier,
        PrmVerificationChannel $channel,
        PrmVerificationPurpose $purpose,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): void {
        $lock = Cache::lock(
            $this->requestLockKey($identifier, $purpose),
            20
        );

        if (! $lock->get()) {
            throw new PrmAuthException(
                'prm_auth_request_in_progress',
                409
            );
        }

        try {
            $this->ensureRequestIsAllowed(
                $identifier,
                $purpose,
                $ipAddress
            );

            $plainCode = (string) random_int(100000, 999999);

            if ($channel === PrmVerificationChannel::SMS) {
                $result = $this->smsNotification->sendVerificationCode(
                    $identifier,
                    $plainCode
                );

                if (! $result->isSuccessful()) {
                    throw new PrmAuthException(
                        'prm_auth_sms_delivery_failed:' . $result->getErrorCode(),
                        503
                    );
                }
            } else {
                $this->emailService->sendVerificationCode(
                    $identifier,
                    $plainCode
                );
            }

            DB::transaction(function () use (
                $identifier,
                $channel,
                $purpose,
                $plainCode,
                $ipAddress,
                $userAgent
            ): void {
                PrmVerificationCode::query()
                    ->where('identifier', $identifier)
                    ->where('purpose', $purpose)
                    ->whereNull('verified_at')
                    ->delete();

                PrmVerificationCode::query()->create([
                    'identifier' => $identifier,
                    'channel' => $channel,
                    'purpose' => $purpose,
                    'code_hash' => Hash::make($plainCode),
                    'expires_at' => now()->addMinutes(2),
                    'ip_address' => $ipAddress,
                    'user_agent' => Str::limit(
                        (string) $userAgent,
                        1000,
                        ''
                    ),
                ]);
            });
        } catch (PrmAuthException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            report($exception);

            throw new PrmAuthException(
                'prm_auth_delivery_failed',
                503
            );
        } finally {
            $lock->release();
        }
    }

    public function verify(
        string $identifier,
        string $code,
        PrmVerificationPurpose $purpose
    ): string {
        $lock = Cache::lock(
            $this->verificationLockKey($identifier, $purpose),
            15
        );

        if (! $lock->get()) {
            throw new PrmAuthException(
                'prm_auth_verification_in_progress',
                409
            );
        }

        try {
            return DB::transaction(function () use (
                $identifier,
                $code,
                $purpose
            ): string {
                $record = PrmVerificationCode::query()
                    ->where('identifier', $identifier)
                    ->where('purpose', $purpose)
                    ->whereNull('verified_at')
                    ->latest('id')
                    ->lockForUpdate()
                    ->first();

                if (! $record) {
                    throw new PrmAuthException(
                        'prm_auth_invalid_verification_code',
                        422
                    );
                }

                if ($record->expires_at->isPast()) {
                    $record->delete();

                    throw new PrmAuthException(
                        'prm_auth_verification_code_expired',
                        422
                    );
                }

                if ($record->attempts >= 3) {
                    $record->delete();

                    throw new PrmAuthException(
                        'prm_auth_verification_attempts_exceeded',
                        429
                    );
                }

                if (! Hash::check($code, $record->code_hash)) {
                    $record->increment('attempts');

                    throw new PrmAuthException(
                        'prm_auth_invalid_verification_code',
                        422
                    );
                }

                $token = Str::random(64);

                $record->update([
                    'verified_at' => now(),
                    'token_hash' => Hash::make($token),
                ]);

                return $token;
            });
        } finally {
            $lock->release();
        }
    }

    public function validateToken(
        string $identifier,
        string $token,
        PrmVerificationPurpose $purpose
    ): bool {
        $record = PrmVerificationCode::query()
            ->where('identifier', $identifier)
            ->where('purpose', $purpose)
            ->whereNotNull('verified_at')
            ->where('verified_at', '>=', now()->subMinutes(15))
            ->latest('id')
            ->first();

        return $record &&
            filled($record->token_hash) &&
            Hash::check($token, $record->token_hash);
    }

    public function consumeToken(
        string $identifier,
        string $token,
        PrmVerificationPurpose $purpose
    ): void {
        DB::transaction(function () use (
            $identifier,
            $token,
            $purpose
        ): void {
            $record = PrmVerificationCode::query()
                ->where('identifier', $identifier)
                ->where('purpose', $purpose)
                ->whereNotNull('verified_at')
                ->latest('id')
                ->lockForUpdate()
                ->first();

            if (
                $record &&
                filled($record->token_hash) &&
                Hash::check($token, $record->token_hash)
            ) {
                $record->delete();
            }
        });
    }

    private function ensureRequestIsAllowed(
        string $identifier,
        PrmVerificationPurpose $purpose,
        ?string $ipAddress
    ): void {
        $now = now();

        $latestRecord = PrmVerificationCode::query()
            ->where('identifier', $identifier)
            ->where('purpose', $purpose)
            ->latest('id')
            ->first();

        if (
            $latestRecord &&
            $latestRecord->created_at->greaterThan(
                $now->copy()->subSeconds(60)
            )
        ) {
            throw new PrmAuthException(
                'prm_auth_code_recently_sent',
                429
            );
        }

        $identifierRequestCount = PrmVerificationCode::query()
            ->where('identifier', $identifier)
            ->where('created_at', '>=', $now->copy()->subMinutes(10))
            ->count();

        if ($identifierRequestCount >= 5) {
            throw new PrmAuthException(
                'prm_auth_request_limit_reached',
                429
            );
        }

        if (! $ipAddress) {
            return;
        }

        $ipRequestCount = PrmVerificationCode::query()
            ->where('ip_address', $ipAddress)
            ->where('created_at', '>=', $now->copy()->subMinutes(10))
            ->count();

        if ($ipRequestCount >= 20) {
            throw new PrmAuthException(
                'prm_auth_ip_request_limit_reached',
                429
            );
        }
    }

    private function requestLockKey(
        string $identifier,
        PrmVerificationPurpose $purpose
    ): string {
        return sprintf(
            'prm-auth-request:%s:%s',
            hash('sha256', $identifier),
            $purpose->value
        );
    }

    private function verificationLockKey(
        string $identifier,
        PrmVerificationPurpose $purpose
    ): string {
        return sprintf(
            'prm-auth-verify:%s:%s',
            hash('sha256', $identifier),
            $purpose->value
        );
    }
}
