<?php

namespace App\Http\Controllers\Api\PrmSettings;

use App\Actions\PrmAuth\PrmCreateVerificationCodeAction;
use App\Actions\PrmAuth\PrmVerifyVerificationCodeAction;
use App\Enums\PrmAuth\PrmVerificationChannel;
use App\Enums\PrmAuth\PrmVerificationPurpose;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmSettings\PrmConfirmEmailChangeRequest;
use App\Http\Requests\PrmSettings\PrmRequestEmailChangeRequest;
use App\Http\Requests\PrmSettings\PrmUpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmAccountSettingsController extends Controller
{
    public function getProfile(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->load(['country', 'province', 'city']);

        return response()->json([
            'status' => 'success',
            'user' => $user,
        ]);
    }

    public function updateProfile(PrmUpdateProfileRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validated();
        $validated['name'] = trim($validated['first_name'] . ' ' . $validated['last_name']);

        $user->update($validated);
        $user->load(['country', 'province', 'city']);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_profile_updated_successfully',
            'user' => $user,
        ]);
    }

    public function requestEmailVerification(
        PrmRequestEmailChangeRequest $request,
        PrmCreateVerificationCodeAction $createCodeAction
    ): JsonResponse {
        $email = strtolower(trim($request->string('email')->toString()));

        $createCodeAction->execute(
            $email,
            PrmVerificationChannel::EMAIL,
            PrmVerificationPurpose::EMAIL_VERIFICATION,
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'status' => 'success',
            'code' => 'prm_email_verification_code_sent',
            'expires_in' => 120,
        ]);
    }

    public function confirmEmailVerification(
        PrmConfirmEmailChangeRequest $request,
        PrmVerifyVerificationCodeAction $verifyAction
    ): JsonResponse {
        $email = strtolower(trim($request->string('email')->toString()));
        $code = $request->string('code')->toString();

        $verifyAction->execute(
            $email,
            $code,
            PrmVerificationPurpose::EMAIL_VERIFICATION
        );

        /** @var User $user */
        $user = $request->user();
        $user->update([
            'email' => $email,
            'email_verified_at' => now(),
        ]);

        $user->load(['country', 'province', 'city']);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_email_updated_and_verified',
            'user' => $user,
        ]);
    }
}
