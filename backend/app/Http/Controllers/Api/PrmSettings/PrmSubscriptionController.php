<?php

namespace App\Http\Controllers\Api\PrmSettings;

use App\Http\Controllers\Controller;
use App\Models\PrmPlan;
use App\Models\PrmSubscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrmSubscriptionController extends Controller
{
    public function getUserPlans(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $activeSubscription = PrmSubscription::query()
            ->with('plan')
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('ends_at')->orWhere('ends_at', '>', now());
            })
            ->latest('id')
            ->first();

        $historySubscriptions = PrmSubscription::query()
            ->with('plan')
            ->where('user_id', $user->id)
            ->when($activeSubscription, function ($query) use ($activeSubscription) {
                $query->where('id', '!=', $activeSubscription->id);
            })
            ->orderByDesc('id')
            ->get();

        $availablePlans = PrmPlan::query()
            ->where('is_active', true)
            ->get();

        return response()->json([
            'status' => 'success',
            'active_subscription' => $activeSubscription,
            'history_subscriptions' => $historySubscriptions,
            'available_plans' => $availablePlans,
        ]);
    }
}
