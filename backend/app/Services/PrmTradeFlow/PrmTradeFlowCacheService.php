<?php

namespace App\Services\PrmTradeFlow;

use Closure;
use Illuminate\Support\Facades\Cache;

class PrmTradeFlowCacheService
{
    public function remember(string $scope, array $filters, int $seconds, Closure $resolver): array
    {
        ksort($filters);

        $key = 'prm-tradeflow:v2:'.$scope.':'.hash(
            'sha256',
            json_encode($filters, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE)
        );

        return Cache::remember($key, $seconds, $resolver);
    }
}
