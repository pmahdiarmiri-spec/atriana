<?php

namespace App\Services\PrmAdmin;

use App\Models\PrmSystemSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class PrmGateKeeperService
{
    private const CACHE_KEY = 'prm_system:admin_entry_slug';

    public function getCurrentSlug(): string
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            $setting = PrmSystemSetting::query()
                ->where('key', 'admin_entry_slug')
                ->first();

            if (! $setting) {
                $slug = Str::random(40);
                PrmSystemSetting::query()->create([
                    'key' => 'admin_entry_slug',
                    'value' => $slug,
                ]);

                return $slug;
            }

            return (string) $setting->value;
        });
    }

    public function regenerateSlug(): string
    {
        $newSlug = Str::random(48);

        PrmSystemSetting::query()->updateOrCreate(
            ['key' => 'admin_entry_slug'],
            ['value' => $newSlug]
        );

        Cache::forget(self::CACHE_KEY);
        Cache::forever(self::CACHE_KEY, $newSlug);

        return $newSlug;
    }

    public function validateSlug(?string $givenSlug): bool
    {
        if (empty($givenSlug)) {
            return false;
        }

        return hash_equals($this->getCurrentSlug(), $givenSlug);
    }
}
