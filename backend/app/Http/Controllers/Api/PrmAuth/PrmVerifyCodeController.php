<?php

namespace App\Http\Controllers\Api\PrmAuth;

use App\Actions\PrmAuth\PrmNormalizeIdentifierAction;
use App\Actions\PrmAuth\PrmVerifyVerificationCodeAction;
use App\Enums\PrmAuth\PrmVerificationPurpose;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAuth\PrmVerifyCodeRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class PrmVerifyCodeController extends Controller
{
    public function __invoke(
        PrmVerifyCodeRequest $request,
        PrmNormalizeIdentifierAction $normalizeAction,
        PrmVerifyVerificationCodeAction $verifyAction
    ): JsonResponse {
        $parsed = $normalizeAction->execute(
            $request->string('identifier')->toString()
        );

        $purpose = PrmVerificationPurpose::from(
            $request->string('purpose')->toString()
        );

        $token = $verifyAction->execute(
            $parsed['identifier'],
            $request->string('code')->toString(),
            $purpose
        );

        $user = User::query()
            ->where('email', $parsed['identifier'])
            ->orWhere('mobile', $parsed['identifier'])
            ->first();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_auth_verification_successful',
            'identifier' => $parsed['identifier'],
            'channel' => $parsed['channel']->value,
            'is_new_user' => ! (bool) $user,
            'verification_token' => $token,
        ]);
    }
}
