<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrmAdvertisementImage extends Model
{
    protected $table = 'prm_advertisement_images';

    protected $fillable = [
        'advertisement_id',
        'path',
        'position',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
        ];
    }

    public function advertisement(): BelongsTo
    {
        return $this->belongsTo(PrmAdvertisement::class, 'advertisement_id');
    }
}
