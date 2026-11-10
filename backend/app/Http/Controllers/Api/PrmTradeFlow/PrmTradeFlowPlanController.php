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
                'plan_name' => 'پلن جامع تحلیل تجارت خارجی',
                'expires_at' => null,
                'is_mock' => true,
                'can_export' => true,
                'can_filter' => true,
                'can_view_powerbi' => true,
            ],
        ]);
    }

    public function powerBiReports(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'import' => 'https://app.powerbi.com/view?r=eyJrIjoiZjE1NzI1MmItYmY3Ni00NjY1LTkzMjMtNTE3Y2RhZWU0ZmNhIiwidCI6IjM5OTI0MzljLTUyM2EtNDFlZi1iYzRmLWIwMjk1OWQxNWUwOSIsImMiOjEwfQ%3D%3D',
                'export' => 'https://app.powerbi.com/view?r=eyJrIjoiNWVlZDY2NzctY2Y3MS00YmY4LThhM2EtNDQ4MTBmY2E5MWU5IiwidCI6IjM5OTI0MzljLTUyM2EtNDFlZi1iYzRmLWIwMjk1OWQxNWUwOSIsImMiOjEwfQ%3D%3D',
            ],
        ]);
    }
}
