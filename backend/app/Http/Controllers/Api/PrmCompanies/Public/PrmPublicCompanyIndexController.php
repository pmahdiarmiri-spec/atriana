<?php

namespace App\Http\Controllers\Api\PrmCompanies\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PrmCompanies\PrmCompanyResource;
use App\Http\Resources\PrmCompanies\PrmIndustryResource;
use App\Services\PrmCompanies\PrmPublicCompanies\PrmPublicCompanyDirectoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmPublicCompanyIndexController extends Controller
{
    public function __construct(
        private readonly PrmPublicCompanyDirectoryService $directoryService
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $result = $this->directoryService->getDirectoryData($request->all());
        $paginator = $result['paginator'];

        return response()->json([
            'status' => 'success',
            'code' => 'prm_public_companies_loaded',
            'companies' => PrmCompanyResource::collection($paginator->getCollection()),
            'stats' => $result['stats'],
            'filters_meta' => [
                'cities' => $result['filters_meta']['cities'],
                'provinces' => $result['filters_meta']['provinces'],
                'industries' => PrmIndustryResource::collection($result['filters_meta']['industries']),
            ],
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }
}
