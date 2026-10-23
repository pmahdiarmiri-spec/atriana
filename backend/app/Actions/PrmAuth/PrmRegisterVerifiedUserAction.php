<?php

namespace App\Actions\PrmAuth;

use App\Enums\PrmAuth\PrmTradeRole;
use App\Enums\PrmAuth\PrmVerificationChannel;
use App\Enums\PrmAuth\PrmVerificationPurpose;
use App\Exceptions\PrmAuth\PrmAuthException;
use App\Models\User;
use App\Services\PrmAuth\PrmVerificationCodeService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PrmRegisterVerifiedUserAction
{
    public function __construct(
        protected PrmVerificationCodeService $codeService
    ) {
    }

    public function execute(array $data): array
    {
        $identifier = $data['identifier'];
        $channel = PrmVerificationChannel::from($data['channel']);
        $verificationToken = $data['verification_token'];

        $isValid = $this->codeService->validateToken(
            $identifier,
            $verificationToken,
            PrmVerificationPurpose::REGISTRATION
        );

        if (! $isValid) {
            throw new PrmAuthException(
                'prm_auth_invalid_verification_session',
                401
            );
        }

        return DB::transaction(function () use (
            $data,
            $identifier,
            $channel,
            $verificationToken
        ): array {
            $existingUser = User::query()
                ->where('email', $identifier)
                ->orWhere('mobile', $identifier)
                ->lockForUpdate()
                ->first();

            if ($existingUser) {
                throw new PrmAuthException(
                    'prm_auth_account_already_registered',
                    409
                );
            }

            $user = User::query()->create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'name' => trim($data['first_name'] . ' ' . $data['last_name']),
                'email' => $channel === PrmVerificationChannel::EMAIL
                    ? $identifier
                    : null,
                'mobile' => $channel === PrmVerificationChannel::SMS
                    ? $identifier
                    : null,
                'trade_role' => PrmTradeRole::from($data['trade_role']),
                'country_id' => $data['country_id'] ?? null,
                'province_id' => $data['province_id'] ?? null,
                'city_id' => $data['city_id'] ?? null,
                'custom_location' => $data['custom_location'] ?? null,
                'password' => Hash::make($data['password']),
                'email_verified_at' => $channel === PrmVerificationChannel::EMAIL
                    ? now()
                    : null,
                'mobile_verified_at' => $channel === PrmVerificationChannel::SMS
                    ? now()
                    : null,
            ]);

            $this->codeService->consumeToken(
                $identifier,
                $verificationToken,
                PrmVerificationPurpose::REGISTRATION
            );

            $token = $user->createToken('prm-auth-token')->plainTextToken;

            return [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ];
        });
    }
}
