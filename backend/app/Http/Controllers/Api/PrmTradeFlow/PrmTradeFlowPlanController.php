<?php

namespace App\Http\Controllers\Api\PrmTradeFlow;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmTradeFlowPlanController extends Controller
{
    public function status(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'is_active' => true,
                'plan_name' => 'پلن نامحدود سازمانی',
                'expires_at' => null,
                'is_mock' => true,
                'can_export' => true,
                'can_filter' => true,
            ],
        ]);
    }
}
