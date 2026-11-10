<?php

namespace App\Http\Middleware;

use App\Services\PrmChat\PrmChatModeration;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

final class PrmEnforceChatSend
{
    public function handle(Request $request, Closure $next): Response
    {
        return DB::transaction(function () use ($request, $next): Response {
            $conversation = DB::table('prm_conversations')
                ->where('id', (int) $request->route('id'))
                ->lockForUpdate()
                ->first();

            abort_unless($conversation, 404);
            abort_unless(
                PrmChatModeration::isParticipant($conversation, (int) $request->user()->id),
                403
            );
            abort_unless(
                PrmChatModeration::canSend($conversation),
                403,
                'ارسال پیام در این گفتگو توسط مدیریت محدود شده است.'
            );

            return $next($request);
        }, 3);
    }
}
