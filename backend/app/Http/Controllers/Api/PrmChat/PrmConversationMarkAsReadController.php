<?php

namespace App\Http\Controllers\Api\PrmChat;

use App\Http\Controllers\Controller;
use App\Models\PrmChat\PrmConversation;
use App\Models\PrmChat\PrmMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmConversationMarkAsReadController extends Controller
{
    public function __invoke(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $conversation = PrmConversation::query()->findOrFail($id);

        if (!$conversation->isParticipant($user->id)) {
            return response()->json([
                'status' => 'error',
                'code' => 'prm_chat_forbidden',
                'message' => 'دسترسی غیرمجاز.',
            ], 403);
        }

        PrmMessage::query()
            ->where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_messages_marked_as_read',
        ]);
    }
}
