<?php

namespace App\Http\Middleware\PrmAdmin;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PrmRequireAdminRoleMiddleware
{
    public function handle(Request $request, Closure $next, ?string $requiredPermission = null): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'code' => 'prm_admin_unauthorized_access',
            ], 403);
        }

        if (! $user->is_active) {
            $user->currentAccessToken()->delete();

            return response()->json([
                'status' => 'error',
                'code' => 'prm_admin_account_suspended',
            ], 403);
        }

        if ($requiredPermission && ! $user->hasPermission($requiredPermission)) {
            return response()->json([
                'status' => 'error',
                'code' => 'prm_admin_permission_denied',
            ], 403);
        }

        return $next($request);
    }
}
