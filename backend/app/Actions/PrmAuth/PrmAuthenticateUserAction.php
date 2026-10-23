<?php

namespace App\Actions\PrmAuth;

use App\Exceptions\PrmAuth\PrmAuthException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class PrmAuthenticateUserAction
{
    public function execute(
        string $identifier,
        string $password,
        ?string $ipAddress = null
    ): array {
        $rateLimitKey = $this->rateLimitKey(
            $identifier,
            $ipAddress
        );

        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            throw new PrmAuthException(
                'prm_auth_login_attempts_exceeded',
                429
            );
        }

        $user = User::query()
            ->where('email', $identifier)
            ->orWhere('mobile', $identifier)
            ->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            RateLimiter::hit($rateLimitKey, 300);

            throw new PrmAuthException(
                'prm_auth_invalid_credentials',
                422
            );
        }

        RateLimiter::clear($rateLimitKey);

        $token = $user->createToken('prm-auth-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    private function rateLimitKey(
        string $identifier,
        ?string $ipAddress
    ): string {
        return sprintf(
            'prm-auth-password:%s:%s',
            hash('sha256', $identifier),
            hash('sha256', (string) $ipAddress)
        );
    }
}
