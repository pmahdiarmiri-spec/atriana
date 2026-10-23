<?php

namespace App\Models;

use App\Enums\PrmSupport\PrmTicketPriority;
use App\Enums\PrmSupport\PrmTicketStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrmTicket extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'ticket_number',
        'subject',
        'status',
        'priority',
        'last_reply_at',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => PrmTicketStatus::class,
            'priority' => PrmTicketPriority::class,
            'last_reply_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PrmTicketCategory::class, 'category_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(PrmTicketMessage::class, 'ticket_id');
    }

    public static function generateTicketNumber(): string
    {
        do {
            $number = 'ATR-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
        } while (self::where('ticket_number', $number)->exists());

        return $number;
    }
}
