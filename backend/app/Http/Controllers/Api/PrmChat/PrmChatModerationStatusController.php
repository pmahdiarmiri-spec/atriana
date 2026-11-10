<?php

namespace App\Http\Controllers\Api\PrmChat;

use App\Http\Controllers\Controller;
use App\Services\PrmChat\PrmChatModeration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

final class PrmChatModerationStatusController extends Controller
{
    public function __invoke(Request $request, int $id): JsonResponse
    {
        $conversation = DB::table('prm_conversations')->where('id', $id)->first();

        abort_unless($conversation, 404);
        abort_unless(
            PrmChatModeration::isParticipant($conversation, (int) $request->user()->id),
            403
        );

        return response()->json([
            'status' => 'success',
            'data' => [
                'status' => PrmChatModeration::status($conversation),
                'can_send' => PrmChatModeration::canSend($conversation),
                'suspended_until' => $conversation->suspended_until,
            ],
        ]);
    }
}
