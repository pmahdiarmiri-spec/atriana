<?php

namespace App\Actions\PrmAdmin;

use App\Exceptions\PrmAuth\PrmAuthException;
use App\Models\PrmAdminAuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class PrmAdminAuthenticateAction
{
    public function execute(string $identifier, string $password, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        $rateLimitKey = sprintf('prm-admin-auth:%s:%s', hash('sha256', $identifier), hash('sha256', (string) $ipAddress));

        if (RateLimiter::tooManyAttempts($rateLimitKey, 3)) {
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
            throw new PrmAuthException('prm_admin_invalid_credentials', 401);
        }

        if (! $user->is_active) {
            throw new PrmAuthException('prm_admin_account_disabled', 403);
        }

        RateLimiter::clear($rateLimitKey);

        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $ipAddress,
        ]);

        PrmAdminAuditLog::query()->create([
            'user_id' => $user->id,
            'action' => 'admin_authenticated',
            'target_type' => User::class,
            'target_id' => $user->id,
            'payload' => ['identifier' => $identifier],
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        $abilities = $user->isSuperAdmin()
            ? ['*']
            : ['admin:moderate', 'admin:access'];

        $token = $user->createToken('prm-admin-token', $abilities)->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ];
    }
}
