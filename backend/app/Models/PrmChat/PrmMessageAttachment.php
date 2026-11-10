<?php

namespace App\Models\PrmChat;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use RuntimeException;

class PrmMessageAttachment extends Model
{
    protected $table = 'prm_message_attachments';

    protected $fillable = [
        'message_id',
        'kind',
        'disk',
        'path',
        'name',
        'mime',
        'size',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::updating(function () {
            throw new RuntimeException('Stored chat attachments are immutable.');
        });

        static::deleting(function () {
            throw new RuntimeException('Stored chat attachments are immutable.');
        });
    }

    public function message(): BelongsTo
    {
        return $this->belongsTo(PrmMessage::class, 'message_id');
    }
}
