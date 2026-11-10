<?php

namespace App\Http\Controllers\Api\PrmAdmin\PrmAdChats;

use App\Http\Controllers\Controller;
use App\Models\PrmAdminAuditLog;
use App\Services\PrmChat\PrmChatModeration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

final class PrmAdminChatActionsController extends Controller
{
    public function show(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $conversation = DB::table('prm_conversations')->where('id', $id)->first();

        abort_unless($conversation, 404);

        $actions = DB::table('prm_chat_moderation_actions')
            ->where('conversation_id', $id)
            ->orderByDesc('id')
            ->limit(30)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'conversation_id' => $id,
                'status' => PrmChatModeration::status($conversation),
                'can_send' => PrmChatModeration::canSend($conversation),
                'suspended_until' => $conversation->suspended_until,
                'actions' => $actions,
            ],
        ]);
    }

    public function store(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'action' => ['required', Rule::in([
                'suspend',
                'block',
                'close',
                'restore',
            ])],
            'reason' => ['required', 'string', 'min:5', 'max:1000'],
            'suspended_until' => [
                'required_if:action,suspend',
                'prohibited_unless:action,suspend',
                'nullable',
                'date',
                'after:now',
            ],
        ]);

        DB::transaction(function () use ($request, $data, $id): void {
            $conversation = DB::table('prm_conversations')
                ->where('id', $id)
                ->lockForUpdate()
                ->first();

            abort_unless($conversation, 404);

            $newStatus = match ($data['action']) {
                'suspend' => 'suspended',
                'block' => 'blocked',
                'close' => 'closed',
                'restore' => 'active',
            };

            abort_if(
                $conversation->moderation_status === $newStatus
                    && $data['action'] !== 'suspend',
                409,
                'گفتگو هم‌اکنون در همین وضعیت است.'
            );

            $until = $data['action'] === 'suspend'
                ? $data['suspended_until']
                : null;

            DB::table('prm_conversations')->where('id', $id)->update([
                'moderation_status' => $newStatus,
                'suspended_until' => $until,
                'moderation_reason' => $data['reason'],
                'moderated_by' => (int) $request->user()->id,
                'moderated_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('prm_chat_moderation_actions')->insert([
                'conversation_id' => $id,
                'admin_id' => (int) $request->user()->id,
                'action' => $data['action'],
                'previous_status' => $conversation->moderation_status,
                'new_status' => $newStatus,
                'reason' => $data['reason'],
                'suspended_until' => $until,
                'created_at' => now(),
            ]);

            PrmAdminAuditLog::create([
                'user_id' => (int) $request->user()->id,
                'action' => 'admin_chat_moderation_changed',
                'target_type' => 'prm_conversation',
                'target_id' => $id,
                'payload' => [
                    'action' => $data['action'],
                    'previous_status' => $conversation->moderation_status,
                    'new_status' => $newStatus,
                    'reason' => $data['reason'],
                    'suspended_until' => $until,
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }, 3);

        return $this->show($request, $id);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->isAdmin(), 403);
    }
}
