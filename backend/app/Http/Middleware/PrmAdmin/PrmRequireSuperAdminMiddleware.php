<?php

namespace App\Http\Middleware\PrmAdmin;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PrmRequireSuperAdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'code' => 'prm_admin_super_admin_required',
            ], 403);
        }

        return $next($request);
    }
}
