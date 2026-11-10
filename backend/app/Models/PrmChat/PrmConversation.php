<?php

namespace App\Models\PrmChat;

use App\Models\PrmAdvertisement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PrmConversation extends Model
{
    use HasFactory;

    protected $table = 'prm_conversations';

    protected $fillable = [
        'advertisement_id',
        'creator_id',
        'recipient_id',
        'last_message_at',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
        ];
    }

    public function advertisement(): BelongsTo
    {
        return $this->belongsTo(PrmAdvertisement::class, 'advertisement_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(PrmMessage::class, 'conversation_id');
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(PrmMessage::class, 'conversation_id')->latestOfMany('id');
    }

    public function isParticipant(int $userId): bool
    {
        return $this->creator_id === $userId || $this->recipient_id === $userId;
    }

    public function getOtherParticipant(int $userId): ?User
    {
        if ($this->creator_id === $userId) {
            return $this->recipient;
        }

        if ($this->recipient_id === $userId) {
            return $this->creator;
        }

        return null;
    }
}
