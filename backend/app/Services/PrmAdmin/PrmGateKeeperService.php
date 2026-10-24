<?php

namespace App\Services\PrmAdmin;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PrmGateKeeperService
{
    private const SETTING_KEY = 'admin_entry_slug';
    private const CACHE_KEY = 'prm_system:admin_entry_slug_v2';
    private const LEGACY_CACHE_KEY = 'prm_system:admin_entry_slug';
    private const CONSUMED_CACHE_PREFIX = 'prm_system:admin_gate_consumed:';
    private const SLUG_TTL_SECONDS = 600;

    public function getCurrentSlug(): string
    {
        $payload = $this->getValidSlugPayload();

        return (string) ($payload['slug'] ?? '');
    }

    public function getSlugMetadata(): array
    {
        $payload = $this->getValidSlugPayload();
        $isConsumed = ! empty($payload['consumed']);
        $expiresAtTimestamp = (int) ($payload['expires_at'] ?? 0);
        $expiresAt = Carbon::createFromTimestamp($expiresAtTimestamp);
        $remainingSeconds = $isConsumed ? 0 : (int) max(0, now()->timestamp <= $expiresAtTimestamp ? $expiresAtTimestamp - now()->timestamp : 0);

        return [
            'slug' => (string) ($payload['slug'] ?? ''),
            'expires_at' => $expiresAt->toIso8601String(),
            'remaining_seconds' => $remainingSeconds,
            'ttl_minutes' => 10,
            'is_one_time' => true,
            'is_consumed' => $isConsumed,
        ];
    }

    public function regenerateSlug(): string
    {
        $payload = $this->createAndStoreNewSlugPayload();

        return (string) $payload['slug'];
    }

    public function validateSlug(?string $givenSlug): bool
    {
        $givenSlug = trim((string) $givenSlug);

        if ($givenSlug === '') {
            return false;
        }

        if (Cache::has(self::CONSUMED_CACHE_PREFIX . hash('sha256', $givenSlug))) {
            return false;
        }

        $payload = $this->resolveExistingPayload();

        if ($payload === null) {
            return false;
        }

        if (! empty($payload['consumed'])) {
            return false;
        }

        if (now()->timestamp >= (int) $payload['expires_at']) {
            $this->invalidateSlug();
            return false;
        }

        if (! hash_equals((string) $payload['slug'], $givenSlug)) {
            return false;
        }

        return true;
    }

    public function consumeSlug(?string $usedSlug = null): void
    {
        $payload = $this->resolveExistingPayload();

        $slugToBlock = ! empty($usedSlug)
            ? trim($usedSlug)
            : ($payload['slug'] ?? null);

        if (! empty($slugToBlock)) {
            Cache::put(self::CONSUMED_CACHE_PREFIX . hash('sha256', (string) $slugToBlock), true, self::SLUG_TTL_SECONDS);
        }

        Cache::forget(self::CACHE_KEY);
        Cache::forget(self::LEGACY_CACHE_KEY);

        if ($payload !== null) {
            $payload['consumed'] = true;
            $payload['consumed_at'] = now()->timestamp;
            $payload['expires_at'] = now()->timestamp;

            $jsonValue = json_encode($payload, JSON_UNESCAPED_SLASHES);

            DB::table('prm_system_settings')
                ->where('key', self::SETTING_KEY)
                ->update([
                    'value' => $jsonValue,
                    'updated_at' => now(),
                ]);
        } else {
            DB::table('prm_system_settings')
                ->where('key', self::SETTING_KEY)
                ->delete();
        }
    }

    public function invalidateSlug(): void
    {
        $payload = $this->resolveExistingPayload();

        if ($payload !== null && ! empty($payload['slug'])) {
            Cache::put(self::CONSUMED_CACHE_PREFIX . hash('sha256', (string) $payload['slug']), true, self::SLUG_TTL_SECONDS);
        }

        Cache::forget(self::CACHE_KEY);
        Cache::forget(self::LEGACY_CACHE_KEY);

        DB::table('prm_system_settings')
            ->where('key', self::SETTING_KEY)
            ->delete();
    }

    private function getValidSlugPayload(): array
    {
        $existing = $this->resolveExistingPayload();

        if (
            $existing !== null &&
            empty($existing['consumed']) &&
            now()->timestamp < (int) $existing['expires_at']
        ) {
            return $existing;
        }

        return $this->createAndStoreNewSlugPayload();
    }

    private function resolveExistingPayload(): ?array
    {
        $row = DB::table('prm_system_settings')
            ->where('key', self::SETTING_KEY)
            ->first();

        if (! $row || empty($row->value)) {
            $cached = Cache::get(self::CACHE_KEY);
            if (is_array($cached) && ! empty($cached['slug']) && ! empty($cached['expires_at'])) {
                return $cached;
            }
            return null;
        }

        $rawValue = trim((string) $row->value);
        $parsed = $this->parseRawValue($rawValue);

        if ($parsed !== null) {
            $remaining = (int) $parsed['expires_at'] - now()->timestamp;
            if ($remaining > 0 && empty($parsed['consumed'])) {
                Cache::put(self::CACHE_KEY, $parsed, $remaining);
            }
            return $parsed;
        }

        if (strlen($rawValue) >= 16 && ! str_starts_with($rawValue, '{')) {
            return $this->upgradePlainSlugToTimedPayload($rawValue);
        }

        return null;
    }

    private function parseRawValue(string $rawValue): ?array
    {
        $decoded = json_decode($rawValue, true);

        if (is_string($decoded)) {
            $decoded = json_decode($decoded, true);
        }

        if (
            is_array($decoded) &&
            ! empty($decoded['slug']) &&
            ! empty($decoded['expires_at'])
        ) {
            return [
                'slug' => trim((string) $decoded['slug']),
                'created_at' => (int) ($decoded['created_at'] ?? now()->timestamp),
                'expires_at' => (int) $decoded['expires_at'],
                'consumed' => (bool) ($decoded['consumed'] ?? false),
                'consumed_at' => isset($decoded['consumed_at']) ? (int) $decoded['consumed_at'] : null,
            ];
        }

        return null;
    }

    private function upgradePlainSlugToTimedPayload(string $plainSlug): array
    {
        $nowTimestamp = now()->timestamp;
        $expiresAt = $nowTimestamp + self::SLUG_TTL_SECONDS;

        $payload = [
            'slug' => trim($plainSlug),
            'created_at' => $nowTimestamp,
            'expires_at' => $expiresAt,
            'consumed' => false,
            'consumed_at' => null,
        ];

        $this->persistPayload($payload);

        return $payload;
    }

    private function createAndStoreNewSlugPayload(): array
    {
        $nowTimestamp = now()->timestamp;
        $expiresAt = $nowTimestamp + self::SLUG_TTL_SECONDS;

        $payload = [
            'slug' => Str::random(48),
            'created_at' => $nowTimestamp,
            'expires_at' => $expiresAt,
            'consumed' => false,
            'consumed_at' => null,
        ];

        $this->persistPayload($payload);

        return $payload;
    }

    private function persistPayload(array $payload): void
    {
        $jsonValue = json_encode($payload, JSON_UNESCAPED_SLASHES);
        $now = now();

        $exists = DB::table('prm_system_settings')
            ->where('key', self::SETTING_KEY)
            ->exists();

        if ($exists) {
            DB::table('prm_system_settings')
                ->where('key', self::SETTING_KEY)
                ->update([
                    'value' => $jsonValue,
                    'updated_at' => $now,
                ]);
        } else {
            DB::table('prm_system_settings')->insert([
                'key' => self::SETTING_KEY,
                'value' => $jsonValue,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        Cache::forget(self::LEGACY_CACHE_KEY);

        if (empty($payload['consumed'])) {
            Cache::put(self::CACHE_KEY, $payload, self::SLUG_TTL_SECONDS);
        } else {
            Cache::forget(self::CACHE_KEY);
        }
    }
}
