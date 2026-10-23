<?php

namespace App\Actions\PrmAuth;

use App\Enums\PrmAuth\PrmVerificationPurpose;
use App\Exceptions\PrmAuth\PrmAuthException;
use App\Models\User;
use App\Services\PrmAuth\PrmVerificationCodeService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PrmResetUserPasswordAction
{
    public function __construct(
        protected PrmVerificationCodeService $codeService
    ) {
    }

    public function execute(
        string $identifier,
        string $token,
        string $newPassword
    ): void {
        $isValid = $this->codeService->validateToken(
            $identifier,
            $token,
            PrmVerificationPurpose::PASSWORD_RESET
        );

        if (! $isValid) {
            throw new PrmAuthException(
                'prm_auth_invalid_verification_session',
                401
            );
        }

        DB::transaction(function () use (
            $identifier,
            $token,
            $newPassword
        ): void {
            $user = User::query()
                ->where('email', $identifier)
                ->orWhere('mobile', $identifier)
                ->lockForUpdate()
                ->first();

            if (! $user) {
                throw new PrmAuthException(
                    'prm_auth_password_reset_unavailable',
                    400
                );
            }

            $user->update([
                'password' => Hash::make($newPassword),
            ]);

            $this->codeService->consumeToken(
                $identifier,
                $token,
                PrmVerificationPurpose::PASSWORD_RESET
            );

            $user->tokens()->delete();
        });
    }
}
