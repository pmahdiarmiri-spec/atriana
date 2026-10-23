<?php

namespace App\Http\Controllers\Api\PrmAdmin;

use App\Actions\PrmAdmin\PrmAdminAuthenticateAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAdmin\PrmAdminLoginRequest;
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
            userAgent: $request->userAgent()
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

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_logout_successful',
        ]);
    }
}
