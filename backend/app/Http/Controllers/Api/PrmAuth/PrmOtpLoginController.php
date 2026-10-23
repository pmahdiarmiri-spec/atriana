<?php

namespace App\Http\Controllers\Api\PrmAuth;

use App\Actions\PrmAuth\PrmNormalizeIdentifierAction;
use App\Enums\PrmAuth\PrmVerificationPurpose;
use App\Exceptions\PrmAuth\PrmAuthException;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAuth\PrmOtpLoginRequest;
use App\Models\User;
use App\Services\PrmAuth\PrmVerificationCodeService;
use Illuminate\Http\JsonResponse;

class PrmOtpLoginController extends Controller
{
    public function __invoke(
        PrmOtpLoginRequest $request,
        PrmNormalizeIdentifierAction $normalizeAction,
        PrmVerificationCodeService $codeService
    ): JsonResponse {
        $parsed = $normalizeAction->execute(
            $request->string('identifier')->toString()
        );

        $isValid = $codeService->validateToken(
            $parsed['identifier'],
            $request->string('verification_token')->toString(),
            PrmVerificationPurpose::LOGIN
        );

        if (! $isValid) {
            throw new PrmAuthException(
                'prm_auth_invalid_verification_session',
                401
            );
        }

        $user = User::query()
            ->where('email', $parsed['identifier'])
            ->orWhere('mobile', $parsed['identifier'])
            ->first();

        if (! $user) {
            throw new PrmAuthException(
                'prm_auth_login_unavailable',
                401
            );
        }

        $codeService->consumeToken(
            $parsed['identifier'],
            $request->string('verification_token')->toString(),
            PrmVerificationPurpose::LOGIN
        );

        $token = $user->createToken('prm-auth-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'code' => 'prm_auth_login_successful',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}
