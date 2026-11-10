<?php

namespace App\Http\Controllers\Api\PrmAdvertisements\Public;

use App\Enums\PrmAdvertisements\PrmAdvertisementStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\PrmAdvertisements\PrmAdvertisementPublicResource;
use App\Models\PrmAdvertisement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmAdvertisementPublicIndexController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $approved = PrmAdvertisementStatus::APPROVED->value;

        $query = PrmAdvertisement::query()
            ->with('images')
            ->where('status', $approved)
            ->latest('id');

        if ($nature = $request->query('nature')) {
            $query->where('nature', $nature);
        }

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        if ($origin = $request->query('origin')) {
            $query->where('origin', $origin);
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        if ($province = $request->query('province')) {
            $query->where('province', $province);
        }

        if ($city = $request->query('city')) {
            $query->where('city', $city);
        }

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('title_en', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        match ($request->query('sort', 'newest')) {
            'popular' => $query->reorder()->orderByDesc('views')->orderByDesc('id'),
            'oldest' => $query->reorder()->oldest('id'),
            default => null,
        };

        $advertisements = $query->paginate((int) $request->query('per_page', 12));

        $statsBase = PrmAdvertisement::query()->where('status', $approved);

        $stats = [
            'total' => (clone $statsBase)->count(),
            'goods_count' => (clone $statsBase)->where('nature', 'goods')->count(),
            'services_count' => (clone $statsBase)->where('nature', 'services')->count(),
            'offers_count' => (clone $statsBase)->where('type', 'offer')->count(),
            'demands_count' => (clone $statsBase)->where('type', 'demand')->count(),
        ];

        return response()->json([
            'status' => 'success',
            'code' => 'prm_public_advertisements_loaded',
            'data' => PrmAdvertisementPublicResource::collection($advertisements),
            'meta' => [
                'current_page' => $advertisements->currentPage(),
                'last_page' => $advertisements->lastPage(),
                'per_page' => $advertisements->perPage(),
                'total' => $advertisements->total(),
                'stats' => $stats,
            ],
        ]);
    }
}
