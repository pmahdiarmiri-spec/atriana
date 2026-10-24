<?php

namespace App\Actions\PrmAdmin;

use App\Exceptions\PrmAuth\PrmAuthException;
use App\Models\PrmAdminAuditLog;
use App\Models\User;
use App\Services\PrmAdmin\PrmAdminSecurityTelemetryService;
use App\Services\PrmAdmin\PrmGateKeeperService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class PrmAdminVerifyOtpAction
{
    public function __construct(
        private readonly PrmGateKeeperService $gateKeeperService,
        private readonly PrmAdminSecurityTelemetryService $telemetryService
    ) {}

    public function execute(
        string $challengeToken,
        string $otpCode,
        ?string $ipAddress = null,
        ?string $userAgent = null,
        ?string $gateSlug = null
    ): array {
        $rateLimitKey = sprintf(
            'prm-admin-otp-verify:%s:%s',
            hash('sha256', $challengeToken),
            hash('sha256', (string) $ipAddress)
        );

        $telemetry = $this->telemetryService->captureContext(null, $ipAddress, $userAgent);

        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            throw new PrmAuthException('prm_admin_login_rate_limited', 429);
        }

        $challengeCacheKey = 'prm_admin_otp_challenge:' . hash('sha256', $challengeToken);
        $challenge = Cache::get($challengeCacheKey);

        if (! is_array($challenge)) {
            RateLimiter::hit($rateLimitKey, 600);
            throw new PrmAuthException('prm_admin_otp_expired_or_invalid', 401);
        }

        $ipMatches = hash_equals((string) ($challenge['ip_hash'] ?? ''), hash('sha256', (string) $ipAddress));
        $uaMatches = hash_equals((string) ($challenge['ua_hash'] ?? ''), hash('sha256', (string) $userAgent));
        $slugMatches = hash_equals((string) ($challenge['gate_slug_hash'] ?? ''), hash('sha256', (string) $gateSlug));

        if (! $ipMatches || ! $uaMatches || ! $slugMatches) {
            Cache::forget($challengeCacheKey);

            PrmAdminAuditLog::query()->create([
                'user_id' => $challenge['user_id'] ?? null,
                'action' => 'admin_otp_context_hijack_detected',
                'target_type' => User::class,
                'target_id' => $challenge['user_id'] ?? null,
                'payload' => [
                    'ip_matched' => $ipMatches,
                    'ua_matched' => $uaMatches,
                    'slug_matched' => $slugMatches,
                    'telemetry' => $telemetry,
                ],
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            throw new PrmAuthException('prm_admin_security_context_mismatch', 403);
        }

        if (! Hash::check($otpCode, (string) $challenge['otp_hash'])) {
            RateLimiter::hit($rateLimitKey, 600);

            $attempts = ((int) ($challenge['attempts'] ?? 0)) + 1;

            if ($attempts >= 3) {
                Cache::forget($challengeCacheKey);
            } else {
                $challenge['attempts'] = $attempts;
                $remainingTtl = max(1, ((int) $challenge['expires_at']) - now()->timestamp);
                Cache::put($challengeCacheKey, $challenge, $remainingTtl);
            }

            PrmAdminAuditLog::query()->create([
                'user_id' => $challenge['user_id'] ?? null,
                'action' => 'admin_otp_verification_failed',
                'target_type' => User::class,
                'target_id' => $challenge['user_id'] ?? null,
                'payload' => [
                    'attempt_number' => $attempts,
                    'challenge_invalidated' => $attempts >= 3,
                    'telemetry' => $telemetry,
                ],
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            throw new PrmAuthException('prm_admin_invalid_otp_code', 401);
        }

        Cache::forget($challengeCacheKey);
        RateLimiter::clear($rateLimitKey);

        $user = User::query()
            ->where('id', (int) $challenge['user_id'])
            ->whereIn('role', ['admin', 'super_admin'])
            ->first();

        if (! $user || ! $user->is_active) {
            throw new PrmAuthException('prm_admin_account_disabled', 403);
        }

        $this->gateKeeperService->consumeSlug($gateSlug);

        $previousLoginAt = $user->last_login_at?->toIso8601String();
        $previousLoginIp = $user->last_login_ip;

        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $ipAddress,
        ]);

        $abilities = $user->isSuperAdmin()
            ? ['*']
            : ['admin:moderate', 'admin:access'];

        $accessTokenInstance = $user->createToken('prm-admin-token', $abilities);
        $plainTextToken = $accessTokenInstance->plainTextToken;

        PrmAdminAuditLog::query()->create([
            'user_id' => $user->id,
            'action' => 'admin_authenticated_2fa_verified',
            'target_type' => User::class,
            'target_id' => $user->id,
            'payload' => [
                'identifier' => $challenge['identifier'] ?? $user->email,
                'role' => $user->role->value ?? (string) $user->role,
                'token_id' => $accessTokenInstance->accessToken->id ?? null,
                'gate_slug_consumed' => true,
                'consumed_gate_slug_hash' => $gateSlug ? hash('sha256', $gateSlug) : null,
                'previous_login_at' => $previousLoginAt,
                'previous_login_ip' => $previousLoginIp,
                'telemetry' => $telemetry,
            ],
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        return [
            'user' => $user,
            'token' => $plainTextToken,
            'token_type' => 'Bearer',
        ];
    }
}
