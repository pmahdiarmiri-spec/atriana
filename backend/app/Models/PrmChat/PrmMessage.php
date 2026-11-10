<?php

namespace App\Models\PrmChat;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use RuntimeException;

class PrmMessage extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'prm_messages';

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'body',
        'read_at',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public static function boot(): void
    {
        parent::boot();

        static::deleting(function () {
            throw new RuntimeException('Deleting messages is strictly forbidden.');
        });

        static::updating(function ($message) {
            $dirty = $message->getDirty();

            if (
                array_key_exists('body', $dirty) ||
                array_key_exists('sender_id', $dirty) ||
                array_key_exists('conversation_id', $dirty)
            ) {
                throw new RuntimeException('Mutating stored message contents is strictly forbidden.');
            }
        });
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(PrmConversation::class, 'conversation_id');
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function attachment(): HasOne
    {
        return $this->hasOne(PrmMessageAttachment::class, 'message_id');
    }
}
