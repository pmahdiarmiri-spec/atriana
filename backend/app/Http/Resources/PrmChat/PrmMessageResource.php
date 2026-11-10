<?php

namespace App\Http\Resources\PrmChat;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrmMessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender_id' => $this->sender_id,
            'body' => $this->body,
            'read_at' => $this->read_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'sender_name' => trim(($this->sender->first_name ?? '') . ' ' . ($this->sender->last_name ?? '')) ?: $this->sender->name,
        ];
    }
}
