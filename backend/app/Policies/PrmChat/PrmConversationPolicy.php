<?php

namespace App\Policies\PrmChat;

use App\Models\PrmChat\PrmConversation;
use App\Models\User;

class PrmConversationPolicy
{
    public function view(User $user, PrmConversation $conversation): bool
    {
        return $conversation->isParticipant($user->id);
    }

    public function sendMessage(User $user, PrmConversation $conversation): bool
    {
        return $conversation->isParticipant($user->id);
    }
}
