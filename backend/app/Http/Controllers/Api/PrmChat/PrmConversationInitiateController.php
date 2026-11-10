<?php

namespace App\Http\Controllers\Api\PrmChat;

use App\Events\PrmChat\PrmMessageSentEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmChat\PrmStartConversationRequest;
use App\Http\Resources\PrmChat\PrmConversationResource;
use App\Models\PrmAdvertisement;
use App\Models\PrmChat\PrmConversation;
use App\Models\PrmChat\PrmMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PrmConversationInitiateController extends Controller
{
    public function __invoke(PrmStartConversationRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $ad = PrmAdvertisement::query()->findOrFail($validated['advertisement_id']);

        if ($ad->user_id === $user->id) {
            return response()->json([
                'status' => 'error',
                'code' => 'prm_chat_self_forbidden',
                'message' => 'امکان ارسال پیام به آگهی خودتان وجود ندارد.',
            ], 422);
        }

        $conversation = PrmConversation::query()
            ->where('advertisement_id', $ad->id)
            ->where(function ($query) use ($user, $ad) {
                $query->where(function ($q) use ($user, $ad) {
                    $q->where('creator_id', $user->id)->where('recipient_id', $ad->user_id);
                })->orWhere(function ($q) use ($user, $ad) {
                    $q->where('creator_id', $ad->user_id)->where('recipient_id', $user->id);
                });
            })
            ->first();

        if (!$conversation) {
            $conversation = DB::transaction(function () use ($user, $ad, $validated) {
                $conv = PrmConversation::create([
                    'advertisement_id' => $ad->id,
                    'creator_id' => $user->id,
                    'recipient_id' => $ad->user_id,
                    'last_message_at' => now(),
                ]);

                if (!empty($validated['message'])) {
                    $msg = PrmMessage::create([
                        'conversation_id' => $conv->id,
                        'sender_id' => $user->id,
                        'body' => $validated['message'],
                        'created_at' => now(),
                    ]);

                    broadcast(new PrmMessageSentEvent($msg->load('sender')))->toOthers();
                }

                return $conv;
            });
        }

        $conversation->load(['advertisement.images', 'creator.company', 'recipient.company', 'latestMessage.sender']);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_conversation_ready',
            'data' => new PrmConversationResource($conversation),
        ], 200);
    }
}
