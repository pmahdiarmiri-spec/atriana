<?php

namespace App\Http\Controllers\Api\PrmSupport;

use App\Http\Controllers\Controller;
use App\Models\PrmTicketCategory;
use Illuminate\Http\JsonResponse;

class PrmTicketCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = PrmTicketCategory::query()
            ->where('is_active', true)
            ->get(['id', 'slug', 'name_fa', 'name_en']);

        return response()->json([
            'status' => 'success',
            'categories' => $categories,
        ]);
    }
}
