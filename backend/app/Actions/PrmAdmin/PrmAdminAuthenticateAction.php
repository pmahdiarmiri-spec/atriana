<?php

namespace App\Actions\PrmAdmin;

use App\Exceptions\PrmAuth\PrmAuthException;
use App\Models\PrmAdminAuditLog;
use App\Models\User;
use App\Services\PrmAdmin\PrmAdminSecurityTelemetryService;
use App\Services\PrmNotifications\Channels\PrmAuthSmsNotificationService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class PrmAdminAuthenticateAction
{
    private const OTP_TTL_SECONDS = 120;

    public function __construct(
        private readonly PrmAuthSmsNotificationService $smsNotificationService,
        private readonly PrmAdminSecurityTelemetryService $telemetryService
    ) {}

    public function execute(
        string $identifier,
        string $password,
        ?string $ipAddress = null,
        ?string $userAgent = null,
        ?string $gateSlug = null
    ): array {
        $rateLimitKey = sprintf(
            'prm-admin-auth:%s:%s',
            hash('sha256', strtolower(trim($identifier))),
            hash('sha256', (string) $ipAddress)
        );

        $telemetry = $this->telemetryService->captureContext(null, $ipAddress, $userAgent);

        if (RateLimiter::tooManyAttempts($rateLimitKey, 3)) {
            PrmAdminAuditLog::query()->create([
                'user_id' => null,
                'action' => 'admin_login_rate_limited',
                'target_type' => User::class,
                'target_id' => null,
                'payload' => [
                    'identifier' => $identifier,
                    'gate_slug_hash' => $gateSlug ? hash('sha256', $gateSlug) : null,
                    'telemetry' => $telemetry,
                ],
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            throw new PrmAuthException('prm_admin_login_rate_limited', 429);
        }

        $user = User::query()
            ->where(function ($query) use ($identifier) {
                $query->where('email', $identifier)->orWhere('mobile', $identifier);
            })
            ->whereIn('role', ['admin', 'super_admin'])
            ->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            RateLimiter::hit($rateLimitKey, 600);

            PrmAdminAuditLog::query()->create([
                'user_id' => $user?->id,
                'action' => 'admin_login_failed_credentials',
                'target_type' => User::class,
                'target_id' => $user?->id,
                'payload' => [
                    'identifier' => $identifier,
                    'gate_slug_hash' => $gateSlug ? hash('sha256', $gateSlug) : null,
                    'telemetry' => $telemetry,
                ],
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            throw new PrmAuthException('prm_admin_invalid_credentials', 401);
        }

        if (! $user->is_active) {
            PrmAdminAuditLog::query()->create([
                'user_id' => $user->id,
                'action' => 'admin_login_blocked_disabled_account',
                'target_type' => User::class,
                'target_id' => $user->id,
                'payload' => [
                    'identifier' => $identifier,
                    'telemetry' => $telemetry,
                ],
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            throw new PrmAuthException('prm_admin_account_disabled', 403);
        }

        if (empty($user->mobile)) {
            throw new PrmAuthException('prm_admin_mobile_not_configured', 422);
        }

        $otpSendLimitKey = sprintf('prm-admin-otp-send:%d:%s', $user->id, hash('sha256', (string) $ipAddress));

        if (RateLimiter::tooManyAttempts($otpSendLimitKey, 3)) {
            throw new PrmAuthException('prm_admin_otp_rate_limited', 429);
        }

        RateLimiter::hit($otpSendLimitKey, 300);

        $otpCode = (string) random_int(100000, 999999);
        $challengeToken = Str::random(64);
        $challengeCacheKey = 'prm_admin_otp_challenge:' . hash('sha256', $challengeToken);

        $smsResult = $this->smsNotificationService->sendVerificationCode((string) $user->mobile, $otpCode);

        if (! $smsResult->isSuccessful()) {
            PrmAdminAuditLog::query()->create([
                'user_id' => $user->id,
                'action' => 'admin_login_otp_sms_failed',
                'target_type' => User::class,
                'target_id' => $user->id,
                'payload' => [
                    'identifier' => $identifier,
                    'mobile_masked' => $this->maskMobile((string) $user->mobile),
                    'sms_error_code' => $smsResult->getErrorCode(),
                    'sms_error_message' => $smsResult->getErrorMessage(),
                    'telemetry' => $telemetry,
                ],
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            throw new PrmAuthException('prm_admin_otp_dispatch_failed', 503);
        }

        RateLimiter::clear($rateLimitKey);

        Cache::put($challengeCacheKey, [
            'user_id' => $user->id,
            'identifier' => $identifier,
            'otp_hash' => Hash::make($otpCode),
            'ip_hash' => hash('sha256', (string) $ipAddress),
            'ua_hash' => hash('sha256', (string) $userAgent),
            'gate_slug_hash' => hash('sha256', (string) $gateSlug),
            'attempts' => 0,
            'created_at' => now()->timestamp,
            'expires_at' => now()->addSeconds(self::OTP_TTL_SECONDS)->timestamp,
        ], self::OTP_TTL_SECONDS);

        PrmAdminAuditLog::query()->create([
            'user_id' => $user->id,
            'action' => 'admin_otp_challenge_issued',
            'target_type' => User::class,
            'target_id' => $user->id,
            'payload' => [
                'identifier' => $identifier,
                'mobile_masked' => $this->maskMobile((string) $user->mobile),
                'expires_in_seconds' => self::OTP_TTL_SECONDS,
                'gate_slug_hash' => $gateSlug ? hash('sha256', $gateSlug) : null,
                'telemetry' => $telemetry,
            ],
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        return [
            'requires_otp' => true,
            'challenge_token' => $challengeToken,
            'masked_mobile' => $this->maskMobile((string) $user->mobile),
            'expires_in' => self::OTP_TTL_SECONDS,
        ];
    }

    private function maskMobile(string $mobile): string
    {
        $length = strlen($mobile);

        if ($length < 7) {
            return '****';
        }

        return substr($mobile, 0, 4) . str_repeat('*', max(2, $length - 7)) . substr($mobile, -3);
    }
}
