<?php

namespace App\Http\Controllers\Api\PrmAuth;

use App\Actions\PrmAuth\PrmNormalizeIdentifierAction;
use App\Actions\PrmAuth\PrmRegisterVerifiedUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAuth\PrmRegisterRequest;
use Illuminate\Http\JsonResponse;

class PrmRegisterController extends Controller
{
    public function __invoke(
        PrmRegisterRequest $request,
        PrmNormalizeIdentifierAction $normalizeAction,
        PrmRegisterVerifiedUserAction $registerAction
    ): JsonResponse {
        $parsed = $normalizeAction->execute(
            $request->string('identifier')->toString()
        );

        $payload = array_merge($request->validated(), [
            'identifier' => $parsed['identifier'],
            'channel' => $parsed['channel']->value,
        ]);

        $result = $registerAction->execute($payload);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_auth_registration_successful',
            'user' => $result['user'],
            'token' => $result['token'],
            'token_type' => $result['token_type'],
        ], 201);
    }
}
