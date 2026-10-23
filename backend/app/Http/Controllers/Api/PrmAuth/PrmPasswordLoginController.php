<?php

namespace App\Http\Controllers\Api\PrmAuth;

use App\Actions\PrmAuth\PrmAuthenticateUserAction;
use App\Actions\PrmAuth\PrmNormalizeIdentifierAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAuth\PrmPasswordLoginRequest;
use Illuminate\Http\JsonResponse;

class PrmPasswordLoginController extends Controller
{
    public function __invoke(
        PrmPasswordLoginRequest $request,
        PrmNormalizeIdentifierAction $normalizeAction,
        PrmAuthenticateUserAction $authenticateAction
    ): JsonResponse {
        $parsed = $normalizeAction->execute(
            $request->string('identifier')->toString()
        );

        $result = $authenticateAction->execute(
            $parsed['identifier'],
            $request->string('password')->toString(),
            $request->ip()
        );

        return response()->json([
            'status' => 'success',
            'code' => 'prm_auth_login_successful',
            'user' => $result['user'],
            'token' => $result['token'],
            'token_type' => $result['token_type'],
        ]);
    }
}
