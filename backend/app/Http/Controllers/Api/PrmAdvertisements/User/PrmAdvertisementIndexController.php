<?php

namespace App\Http\Controllers\Api\PrmAdvertisements\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\PrmAdvertisements\PrmAdvertisementResource;
use App\Models\PrmAdvertisement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmAdvertisementIndexController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = PrmAdvertisement::query()
            ->where('user_id', $user->id)
            ->latest('id');

        if ($nature = $request->query('nature')) {
            $query->where('nature', $nature);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $advertisements = $query->paginate((int) $request->query('per_page', 15));

        return response()->json([
            'status' => 'success',
            'code' => 'prm_advertisements_loaded',
            'data' => PrmAdvertisementResource::collection($advertisements),
            'meta' => [
                'current_page' => $advertisements->currentPage(),
                'last_page' => $advertisements->lastPage(),
                'per_page' => $advertisements->perPage(),
                'total' => $advertisements->total(),
            ],
        ]);
    }
}
