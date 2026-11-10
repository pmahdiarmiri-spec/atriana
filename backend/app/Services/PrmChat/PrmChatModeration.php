<?php

namespace App\Services\PrmChat;

use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;

final class PrmChatModeration
{
    public static function status(object $conversation): string
    {
        $status = $conversation->moderation_status;

        if ($status !== 'suspended') {
            return $status;
        }

        $until = $conversation->suspended_until;

        if ($until !== null && Carbon::parse($until)->lessThanOrEqualTo(Carbon::now())) {
            return 'active';
        }

        return 'suspended';
    }

    public static function canSend(object $conversation): bool
    {
        return self::status($conversation) === 'active';
    }

    public static function isParticipant(object $conversation, int $userId): bool
    {
        return in_array($userId, [
            (int) $conversation->creator_id,
            (int) $conversation->recipient_id,
        ], true);
    }
}
