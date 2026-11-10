<?php

namespace App\Http\Controllers\Api\PrmAdvertisements\Public;

use App\Enums\PrmAdvertisements\PrmAdvertisementStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\PrmAdvertisements\PrmAdvertisementPublicResource;
use App\Models\PrmAdvertisement;
use Illuminate\Http\JsonResponse;

class PrmAdvertisementPublicShowController extends Controller
{
    public function __invoke(string $slug): JsonResponse
    {
        $decodedSlug = urldecode($slug);

        $advertisement = PrmAdvertisement::query()
            ->with('images')
            ->where(function ($query) use ($slug, $decodedSlug) {
                $query->where('slug', $decodedSlug)
                    ->orWhere('slug', $slug);
            })
            ->where('status', PrmAdvertisementStatus::APPROVED->value)
            ->first();

        if (!$advertisement) {
            return response()->json([
                'status' => 'error',
                'code' => 'prm_advertisement_not_found',
                'message' => 'آگهی موردنظر یافت نشد.',
            ], 404);
        }

        $advertisement->increment('views');

        return response()->json([
            'status' => 'success',
            'code' => 'prm_public_advertisement_loaded',
            'data' => new PrmAdvertisementPublicResource($advertisement),
        ]);
    }
}
