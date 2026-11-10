<?php

namespace App\Http\Resources\PrmChat;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrmConversationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $currentUserId = $request->user()?->id;
        $otherUser = $this->getOtherParticipant((int) $currentUserId);

        $unreadCount = $this->messages()
            ->where('sender_id', '!=', $currentUserId)
            ->whereNull('read_at')
            ->count();

        return [
            'id' => $this->id,
            'advertisement_id' => $this->advertisement_id,
            'advertisement' => $this->advertisement ? [
                'id' => $this->advertisement->id,
                'title' => $this->advertisement->title,
                'slug' => $this->advertisement->slug,
                'price' => $this->advertisement->price,
                'currency' => $this->advertisement->currency,
                'image_url' => $this->advertisement->images()->first()?->path ? url('storage/' . $this->advertisement->images()->first()->path) : null,
            ] : null,
            'other_user' => $otherUser ? [
                'id' => $otherUser->id,
                'name' => trim(($otherUser->first_name ?? '') . ' ' . ($otherUser->last_name ?? '')) ?: ($otherUser->name ?? 'کاربر آتریانا'),
                'company_name' => $otherUser->company?->name_fa ?? $otherUser->company?->name_en ?? null,
            ] : null,
            'last_message' => $this->latestMessage ? new PrmMessageResource($this->latestMessage) : null,
            'unread_count' => $unreadCount,
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
