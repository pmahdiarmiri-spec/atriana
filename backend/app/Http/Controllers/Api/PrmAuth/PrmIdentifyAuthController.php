<?php

namespace App\Http\Controllers\Api\PrmAuth;

use App\Actions\PrmAuth\PrmNormalizeIdentifierAction;
use App\Enums\PrmAuth\PrmVerificationPurpose;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAuth\PrmAuthIdentifierRequest;
use App\Models\User;
use App\Services\PrmAuth\PrmVerificationCodeService;
use Illuminate\Http\JsonResponse;

class PrmIdentifyAuthController extends Controller
{
    public function __construct(
        protected PrmVerificationCodeService $verificationCodeService,
        protected PrmNormalizeIdentifierAction $normalizeIdentifierAction
    ) {
    }

    public function __invoke(PrmAuthIdentifierRequest $request): JsonResponse
    {
        $parsed = $this->normalizeIdentifierAction->execute(
            $request->string('identifier')->toString()
        );

        $user = User::query()
            ->where('email', $parsed['identifier'])
            ->orWhere('mobile', $parsed['identifier'])
            ->first();

        if ($user && filled($user->password)) {
            return response()->json([
                'status' => 'success',
                'code' => 'prm_auth_password_required',
                'next_step' => 'password',
                'identifier' => $parsed['identifier'],
                'channel' => $parsed['channel']->value,
                'is_existing_user' => true,
            ]);
        }

        $this->verificationCodeService->generateAndSend(
            identifier: $parsed['identifier'],
            channel: $parsed['channel'],
            purpose: PrmVerificationPurpose::REGISTRATION,
            ipAddress: $request->ip(),
            userAgent: $request->userAgent()
        );

        return response()->json([
            'status' => 'success',
            'code' => 'prm_auth_verification_code_sent',
            'next_step' => 'otp',
            'identifier' => $parsed['identifier'],
            'channel' => $parsed['channel']->value,
            'is_existing_user' => false,
            'is_new_user' => true,
            'purpose' => PrmVerificationPurpose::REGISTRATION->value,
            'expires_in' => 120,
        ]);
    }
}
