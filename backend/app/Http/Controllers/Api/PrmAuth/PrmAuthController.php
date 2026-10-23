<?php

namespace App\Http\Controllers\Api\PrmAuth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmAuthController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'code' => 'prm_auth_user_retrieved',
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_auth_logout_successful',
        ]);
    }
}
