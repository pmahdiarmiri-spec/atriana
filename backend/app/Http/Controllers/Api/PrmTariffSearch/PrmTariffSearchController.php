<?php

namespace App\Http\Controllers\Api\PrmTariffSearch;

use App\Http\Controllers\Controller;
use App\Models\PrmTariffData;
use App\Models\PrmTariffSearchLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PrmTariffSearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $startedAt = hrtime(true);

        $query = trim((string) $request->query('q', ''));
        $chapter = trim((string) $request->query('chapter', ''));
        $section = trim((string) $request->query('section', ''));
        $limit = (int) $request->query('limit', 30);
        $limit = max(1, min(100, $limit));

        $dbQuery = PrmTariffData::query();

        if ($chapter !== '') {
            $dbQuery->where('chapter', $chapter);
        }

        if ($section !== '') {
            $dbQuery->where('section', $section);
        }

        if ($query !== '') {
            $cleanedDigits = preg_replace('/\D+/', '', $query) ?? '';
            $compactQuery = str_replace([' ', '.', '-', '/'], '', $query);

            $dbQuery->where(function ($q) use ($query, $cleanedDigits, $compactQuery) {
                if ($cleanedDigits !== '') {
                    $q->where('code_raw', 'like', $cleanedDigits . '%')
                        ->orWhere('code_formatted', 'like', $query . '%');
                } else {
                    $q->where('description', 'like', '%' . $query . '%')
                        ->orWhere('chapter', 'like', '%' . $query . '%')
                        ->orWhere('section', 'like', '%' . $query . '%');
                }

                if ($compactQuery !== '' && $compactQuery !== $cleanedDigits) {
                    $q->orWhere('code_raw', 'like', $compactQuery . '%');
                }
            });
        }

        $items = $dbQuery
            ->select(['id', 'code_raw', 'code_formatted', 'description', 'chapter', 'section'])
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                $digits = preg_replace('/\D+/', '', (string) ($item->code_raw ?? '')) ?? '';
                $item->code_formatted = $digits !== '' ? $digits : (string) $item->code_formatted;
                return $item;
            })
            ->values();

        $durationMs = round((hrtime(true) - $startedAt) / 1_000_000, 2);
        $resultCount = $items->count();

        $user = $request->user();

        PrmTariffSearchLog::create([
            'user_id' => $user?->id,
            'query' => $query === '' ? null : Str::limit($query, 512, ''),
            'filters' => [
                'chapter' => $chapter !== '' ? $chapter : null,
                'section' => $section !== '' ? $section : null,
                'limit' => $limit,
            ],
            'result_count' => $resultCount,
            'duration_ms' => $durationMs,
            'ip' => (string) $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 512, ''),
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_tariff_search_success',
            'meta' => [
                'query' => $query,
                'duration_ms' => $durationMs,
                'result_count' => $resultCount,
            ],
            'items' => $items,
        ]);
    }
}
