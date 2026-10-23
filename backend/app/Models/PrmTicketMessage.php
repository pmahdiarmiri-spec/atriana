<?php

namespace App\Models;

use App\Enums\PrmSupport\PrmTicketMessageSender;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrmTicketMessage extends Model
{
    protected $fillable = [
        'ticket_id',
        'user_id',
        'sender',
        'message',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'sender' => PrmTicketMessageSender::class,
            'read_at' => 'datetime',
        ];
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(PrmTicket::class, 'ticket_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
