<?php

namespace App\Events\PrmChat;

use App\Http\Resources\PrmChat\PrmMessageResource;
use App\Models\PrmChat\PrmMessage;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PrmMessageSentEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public PrmMessage $message)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('prm-conversation.' . $this->message->conversation_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'PrmMessageSent';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => (new PrmMessageResource($this->message))->resolve(),
        ];
    }
}
