<?php

use App\Models\PrmChat\PrmConversation;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('prm-conversation.{id}', function (User $user, int $id) {
    $conversation = PrmConversation::query()->find($id);

    if (!$conversation) {
        return false;
    }

    return $conversation->isParticipant($user->id);
});
