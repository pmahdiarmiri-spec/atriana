<?php

namespace App\Http\Controllers\Api\PrmChat;

use App\Http\Controllers\Controller;
use App\Services\PrmChat\PrmChatModeration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

final class PrmChatReportController extends Controller
{
    public function __invoke(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'reason' => ['required', Rule::in([
                'spam',
                'harassment',
                'fraud',
                'prohibited_content',
                'other',
            ])],
            'details' => ['nullable', 'string', 'max:2000', 'required_if:reason,other'],
            'message_id' => ['nullable', 'integer', 'min:1'],
        ]);

        $userId = (int) $request->user()->id;

        $reportId = DB::transaction(function () use ($data, $id, $userId): int {
            $conversation = DB::table('prm_conversations')
                ->where('id', $id)
                ->lockForUpdate()
                ->first();

            abort_unless($conversation, 404);
            abort_unless(PrmChatModeration::isParticipant($conversation, $userId), 403);

            $reportedUserId = (int) $conversation->creator_id === $userId
                ? (int) $conversation->recipient_id
                : (int) $conversation->creator_id;

            if (isset($data['message_id'])) {
                $message = DB::table('prm_messages')
                    ->where('id', $data['message_id'])
                    ->where('conversation_id', $id)
                    ->first();

                abort_unless(
                    $message && (int) $message->sender_id === $reportedUserId,
                    422,
                    'پیام انتخابی باید متعلق به طرف مقابل همین گفتگو باشد.'
                );
            }

            $duplicate = DB::table('prm_chat_reports')
                ->where('conversation_id', $id)
                ->where('reporter_id', $userId)
                ->where('message_id', $data['message_id'] ?? null)
                ->whereIn('status', ['pending', 'in_review'])
                ->exists();

            abort_if($duplicate, 409, 'برای این مورد گزارشِ در حال بررسی ثبت شده است.');

            return DB::table('prm_chat_reports')->insertGetId([
                'conversation_id' => $id,
                'reporter_id' => $userId,
                'reported_user_id' => $reportedUserId,
                'message_id' => $data['message_id'] ?? null,
                'reason' => $data['reason'],
                'details' => $data['details'] ?? null,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }, 3);

        return response()->json([
            'status' => 'success',
            'data' => ['id' => $reportId, 'status' => 'pending'],
        ], 201);
    }
}
