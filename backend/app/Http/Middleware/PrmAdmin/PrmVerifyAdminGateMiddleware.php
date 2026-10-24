<?php

namespace App\Http\Middleware\PrmAdmin;

use App\Services\PrmAdmin\PrmGateKeeperService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PrmVerifyAdminGateMiddleware
{
    public function __construct(
        protected PrmGateKeeperService $gateKeeperService
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $gateSlug = rawurldecode(trim((string) $request->route('gate_slug')));

        if (! $this->gateKeeperService->validateSlug($gateSlug)) {
            return response()->json([
                'status' => 'error',
                'code' => 'prm_admin_gate_not_found',
            ], 404);
        }

        return $next($request);
    }
}
