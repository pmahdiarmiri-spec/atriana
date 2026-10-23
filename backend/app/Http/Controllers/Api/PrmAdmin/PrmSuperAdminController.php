<?php

namespace App\Http\Controllers\Api\PrmAdmin;

use App\Actions\PrmAdmin\PrmCreateAdminAction;
use App\Actions\PrmAdmin\PrmFetchFilteredUsersAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmAdmin\PrmCreateAdminRequest;
use App\Models\PrmAdminAuditLog;
use App\Models\PrmSubscription;
use App\Services\PrmAdmin\PrmGateKeeperService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmSuperAdminController extends Controller
{
    public function getGateSlug(PrmGateKeeperService $gateKeeperService): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_gate_slug_retrieved',
            'gate_slug' => $gateKeeperService->getCurrentSlug(),
        ]);
    }

    public function regenerateGateSlug(PrmGateKeeperService $gateKeeperService): JsonResponse
    {
        $newSlug = $gateKeeperService->regenerateSlug();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_gate_slug_regenerated',
            'new_gate_slug' => $newSlug,
        ]);
    }

    public function createAdmin(
        PrmCreateAdminRequest $request,
        PrmCreateAdminAction $createAdminAction
    ): JsonResponse {
        $admin = $createAdminAction->execute(
            actor: $request->user(),
            data: $request->validated(),
            ipAddress: $request->ip(),
            userAgent: $request->userAgent()
        );

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_created_successfully',
            'admin' => $admin,
        ], 201);
    }

    public function getUsers(Request $request, PrmFetchFilteredUsersAction $fetchAction): JsonResponse
    {
        $users = $fetchAction->execute($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_users_retrieved',
            'data' => $users,
        ]);
    }

    public function getPayments(Request $request): JsonResponse
    {
        $query = PrmSubscription::query()->with('user');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        if ($request->filled('search')) {
            $search = '%' . $request->string('search')->toString() . '%';
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', $search)->orWhere('email', 'like', $search);
            });
        }

        $payments = $query->latest()->paginate((int) ($request->input('per_page', 20)));

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_payments_retrieved',
            'data' => $payments,
        ]);
    }

    public function getAuditLogs(Request $request): JsonResponse
    {
        $logs = PrmAdminAuditLog::query()
            ->with('user:id,name,email,role')
            ->latest()
            ->paginate((int) ($request->input('per_page', 25)));

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_audit_logs_retrieved',
            'data' => $logs,
        ]);
    }
}
