<?php

namespace App\Http\Controllers\Api\PrmAdmin\PrmAdChats;

use App\Http\Controllers\Controller;
use App\Models\PrmAdminAuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

final class PrmAdminChatReportsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'status' => ['nullable', Rule::in([
                'all',
                'pending',
                'in_review',
                'resolved',
                'rejected',
            ])],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = DB::table('prm_chat_reports as r')
            ->join('prm_conversations as c', 'c.id', '=', 'r.conversation_id')
            ->leftJoin('users as reporter', 'reporter.id', '=', 'r.reporter_id')
            ->leftJoin('users as reported', 'reported.id', '=', 'r.reported_user_id')
            ->leftJoin('prm_messages as m', 'm.id', '=', 'r.message_id')
            ->select(
                'r.id',
                'r.conversation_id',
                'c.advertisement_id',
                'r.reporter_id',
                'reporter.name as reporter_name',
                'r.reported_user_id',
                'reported.name as reported_user_name',
                'r.message_id',
                'm.body as message_body',
                'r.reason',
                'r.details',
                'r.status',
                'r.resolution_note',
                'r.created_at'
            );

        if (($data['status'] ?? 'all') !== 'all') {
            $query->where('r.status', $data['status']);
        }

        $page = $query->orderByDesc('r.id')->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $page->items(),
            'meta' => [
                'current_page' => $page->currentPage(),
                'last_page' => $page->lastPage(),
                'total' => $page->total(),
            ],
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'status' => ['required', Rule::in([
                'in_review',
                'resolved',
                'rejected',
            ])],
            'resolution_note' => [
                'nullable',
                'string',
                'max:2000',
                'required_if:status,resolved,rejected',
            ],
        ]);

        DB::transaction(function () use ($request, $data, $id): void {
            $report = DB::table('prm_chat_reports')
                ->where('id', $id)
                ->lockForUpdate()
                ->first();

            abort_unless($report, 404);

            $allowed = [
                'pending' => ['in_review', 'resolved', 'rejected'],
                'in_review' => ['resolved', 'rejected'],
                'resolved' => ['in_review'],
                'rejected' => ['in_review'],
            ];

            abort_unless(
                in_array($data['status'], $allowed[$report->status] ?? [], true),
                409,
                'تغییر وضعیت گزارش مجاز نیست.'
            );

            DB::table('prm_chat_reports')->where('id', $id)->update([
                'status' => $data['status'],
                'reviewed_by' => (int) $request->user()->id,
                'reviewed_at' => $data['status'] === 'in_review' ? null : now(),
                'resolution_note' => $data['status'] === 'in_review'
                    ? null
                    : $data['resolution_note'],
                'updated_at' => now(),
            ]);

            PrmAdminAuditLog::create([
                'user_id' => (int) $request->user()->id,
                'action' => 'admin_chat_report_status_changed',
                'target_type' => 'prm_chat_report',
                'target_id' => $id,
                'payload' => [
                    'previous_status' => $report->status,
                    'new_status' => $data['status'],
                    'resolution_note' => $data['resolution_note'] ?? null,
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }, 3);

        return response()->json([
            'status' => 'success',
            'data' => ['id' => $id, 'status' => $data['status']],
        ]);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->isAdmin(), 403);
    }
}
