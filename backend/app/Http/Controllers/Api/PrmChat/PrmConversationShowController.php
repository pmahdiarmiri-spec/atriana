<?php

namespace App\Http\Controllers\Api\PrmChat;

use App\Http\Controllers\Controller;
use App\Http\Resources\PrmChat\PrmConversationResource;
use App\Http\Resources\PrmChat\PrmMessageResource;
use App\Models\PrmChat\PrmConversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmConversationShowController extends Controller
{
    public function __invoke(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $conversation = PrmConversation::query()
            ->with(['advertisement.images', 'creator.company', 'recipient.company'])
            ->findOrFail($id);

        if (!$conversation->isParticipant($user->id)) {
            return response()->json([
                'status' => 'error',
                'code' => 'prm_chat_forbidden',
                'message' => 'شما دسترسی به این گفتگو را ندارید.',
            ], 403);
        }

        $messages = $conversation->messages()
            ->with(['sender', 'attachment'])
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_conversation_details_loaded',
            'conversation' => new PrmConversationResource($conversation),
            'messages' => PrmMessageResource::collection($messages),
        ]);
    }
}
