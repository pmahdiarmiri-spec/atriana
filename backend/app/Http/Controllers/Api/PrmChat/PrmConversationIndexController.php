<?php

namespace App\Http\Controllers\Api\PrmChat;

use App\Http\Controllers\Controller;
use App\Http\Resources\PrmChat\PrmConversationResource;
use App\Models\PrmChat\PrmConversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmConversationIndexController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $conversations = PrmConversation::query()
            ->with(['advertisement.images', 'creator.company', 'recipient.company', 'latestMessage.sender'])
            ->where(function ($query) use ($userId) {
                $query->where('creator_id', $userId)
                    ->orWhere('recipient_id', $userId);
            })
            ->orderByDesc('last_message_at')
            ->paginate((int) $request->query('per_page', 20));

        return response()->json([
            'status' => 'success',
            'code' => 'prm_conversations_loaded',
            'data' => PrmConversationResource::collection($conversations),
            'meta' => [
                'current_page' => $conversations->currentPage(),
                'last_page' => $conversations->lastPage(),
                'total' => $conversations->total(),
            ],
        ]);
    }
}
