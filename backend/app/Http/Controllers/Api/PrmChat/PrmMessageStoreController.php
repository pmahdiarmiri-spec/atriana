<?php

namespace App\Http\Controllers\Api\PrmChat;

use App\Events\PrmChat\PrmMessageSentEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmChat\PrmSendMessageRequest;
use App\Http\Resources\PrmChat\PrmMessageResource;
use App\Models\PrmChat\PrmConversation;
use App\Models\PrmChat\PrmMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PrmMessageStoreController extends Controller
{
    public function __invoke(PrmSendMessageRequest $request, int $id): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $conversation = PrmConversation::query()->findOrFail($id);

        if (!$conversation->isParticipant($user->id)) {
            return response()->json([
                'status' => 'error',
                'code' => 'prm_chat_forbidden',
                'message' => 'شما اجازه ارسال پیام در این گفتگو را ندارید.',
            ], 403);
        }

        $message = DB::transaction(function () use ($conversation, $user, $validated) {
            $msg = PrmMessage::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $user->id,
                'body' => $validated['body'],
                'created_at' => now(),
            ]);

            $conversation->update([
                'last_message_at' => now(),
            ]);

            return $msg;
        });

        $message->load('sender');

        broadcast(new PrmMessageSentEvent($message))->toOthers();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_message_created',
            'data' => new PrmMessageResource($message),
        ], 201);
    }
}
