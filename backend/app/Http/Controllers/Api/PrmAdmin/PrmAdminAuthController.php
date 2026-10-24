<?php

namespace App\Http\Controllers\Api\PrmAdmin;

use App\Actions\PrmAdmin\PrmAdminAuthenticateAction;
use App\Actions\PrmAdmin\PrmAdminVerifyOtpAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAdmin\PrmAdminLoginRequest;
use App\Http\Requests\PrmAdmin\PrmAdminVerifyOtpRequest;
use App\Models\PrmAdminAuditLog;
use App\Models\User;
use App\Services\PrmAdmin\PrmAdminSecurityTelemetryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmAdminAuthController extends Controller
{
    public function login(
        PrmAdminLoginRequest $request,
        PrmAdminAuthenticateAction $authenticateAction,
        ?string $gate_slug = null
    ): JsonResponse {
        $result = $authenticateAction->execute(
            identifier: $request->string('identifier')->toString(),
            password: $request->string('password')->toString(),
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
            gateSlug: $gate_slug
        );

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_otp_required',
            'requires_otp' => true,
            'challenge_token' => $result['challenge_token'],
            'masked_mobile' => $result['masked_mobile'],
            'expires_in' => $result['expires_in'],
        ]);
    }

    public function verifyOtp(
        PrmAdminVerifyOtpRequest $request,
        PrmAdminVerifyOtpAction $verifyOtpAction,
        ?string $gate_slug = null
    ): JsonResponse {
        $result = $verifyOtpAction->execute(
            challengeToken: $request->string('challenge_token')->toString(),
            otpCode: $request->string('otp_code')->toString(),
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
            gateSlug: $gate_slug
        );

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_login_successful',
            'admin' => $result['user'],
            'token' => $result['token'],
            'token_type' => $result['token_type'] ?? 'Bearer',
            'redirect_to' => '/admin/dashboard',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_profile_retrieved',
            'admin' => $request->user(),
        ]);
    }

    public function logout(Request $request, PrmAdminSecurityTelemetryService $telemetryService): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            PrmAdminAuditLog::query()->create([
                'user_id' => $user->id,
                'action' => 'admin_logged_out',
                'target_type' => User::class,
                'target_id' => $user->id,
                'payload' => [
                    'telemetry' => $telemetryService->captureContext($request),
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $user->currentAccessToken()?->delete();
        }

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_logout_successful',
        ]);
    }
}
