<?php

namespace App\Http\Controllers\Api\PrmAuth;

use App\Actions\PrmAuth\PrmNormalizeIdentifierAction;
use App\Actions\PrmAuth\PrmResetUserPasswordAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAuth\PrmResetPasswordRequest;
use Illuminate\Http\JsonResponse;

class PrmResetPasswordController extends Controller
{
    public function __invoke(
        PrmResetPasswordRequest $request,
        PrmNormalizeIdentifierAction $normalizeAction,
        PrmResetUserPasswordAction $resetAction
    ): JsonResponse {
        $parsed = $normalizeAction->execute(
            $request->string('identifier')->toString()
        );

        $resetAction->execute(
            $parsed['identifier'],
            $request->string('verification_token')->toString(),
            $request->string('password')->toString()
        );

        return response()->json([
            'status' => 'success',
            'code' => 'prm_auth_password_reset_successful',
        ]);
    }
}
