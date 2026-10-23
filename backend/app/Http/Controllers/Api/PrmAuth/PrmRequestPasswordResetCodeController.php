<?php

namespace App\Http\Controllers\Api\PrmAuth;

use App\Actions\PrmAuth\PrmCreateVerificationCodeAction;
use App\Actions\PrmAuth\PrmNormalizeIdentifierAction;
use App\Enums\PrmAuth\PrmVerificationChannel;
use App\Enums\PrmAuth\PrmVerificationPurpose;
use App\Exceptions\PrmAuth\PrmAuthException;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAuth\PrmRequestPasswordResetCodeRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class PrmRequestPasswordResetCodeController extends Controller
{
    public function __invoke(
        PrmRequestPasswordResetCodeRequest $request,
        PrmNormalizeIdentifierAction $normalizeAction,
        PrmCreateVerificationCodeAction $createCodeAction
    ): JsonResponse {
        $parsed = $normalizeAction->execute(
            $request->string('identifier')->toString()
        );

        if (
            $parsed['channel'] === PrmVerificationChannel::SMS &&
            ! $parsed['is_iran_mobile']
        ) {
            throw new PrmAuthException(
                'prm_auth_email_required_for_international_phone',
                422
            );
        }

        $user = User::query()
            ->where('email', $parsed['identifier'])
            ->orWhere('mobile', $parsed['identifier'])
            ->first();

        if ($user) {
            $createCodeAction->execute(
                $parsed['identifier'],
                $parsed['channel'],
                PrmVerificationPurpose::PASSWORD_RESET,
                $request->ip(),
                $request->userAgent()
            );
        }

        return response()->json([
            'status' => 'success',
            'code' => 'prm_auth_password_reset_request_processed',
            'identifier' => $parsed['identifier'],
            'channel' => $parsed['channel']->value,
            'expires_in' => 120,
        ]);
    }
}
