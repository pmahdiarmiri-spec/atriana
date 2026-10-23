<?php

namespace App\Http\Controllers\Api\PrmAuth;

use App\Actions\PrmAuth\PrmCreateVerificationCodeAction;
use App\Actions\PrmAuth\PrmNormalizeIdentifierAction;
use App\Enums\PrmAuth\PrmVerificationChannel;
use App\Enums\PrmAuth\PrmVerificationPurpose;
use App\Exceptions\PrmAuth\PrmAuthException;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAuth\PrmSendVerificationCodeRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class PrmSendVerificationCodeController extends Controller
{
    public function __invoke(
        PrmSendVerificationCodeRequest $request,
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

        $purpose = PrmVerificationPurpose::from(
            $request->string('purpose')->toString()
        );

        $user = User::query()
            ->where('email', $parsed['identifier'])
            ->orWhere('mobile', $parsed['identifier'])
            ->first();

        if (
            $purpose === PrmVerificationPurpose::LOGIN &&
            ! $user
        ) {
            throw new PrmAuthException(
                'prm_auth_account_not_available',
                422
            );
        }

        if (
            $purpose === PrmVerificationPurpose::REGISTRATION &&
            $user &&
            filled($user->password)
        ) {
            throw new PrmAuthException(
                'prm_auth_account_already_registered',
                409
            );
        }

        $createCodeAction->execute(
            $parsed['identifier'],
            $parsed['channel'],
            $purpose,
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'status' => 'success',
            'code' => 'prm_auth_verification_code_sent',
            'identifier' => $parsed['identifier'],
            'channel' => $parsed['channel']->value,
            'purpose' => $purpose->value,
            'expires_in' => 120,
        ]);
    }
}
