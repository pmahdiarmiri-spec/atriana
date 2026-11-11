<?php

namespace App\Http\Controllers\Api\PrmMeetings;

use App\Http\Controllers\Controller;
use App\Models\PrmMeeting;
use App\Services\PrmMeetings\PrmLiveKitService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PrmMeetingController extends Controller
{
    public function __construct(private readonly PrmLiveKitService $meetings)
    {
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:120'],
            'display_name' => ['required', 'string', 'min:2', 'max:50'],
        ]);

        return response()->json(
            $this->meetings->create(
                $request->user(),
                trim($data['name']),
                trim($data['display_name'])
            ),
            201
        );
    }

    public function join(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'regex:/\A[a-fA-F0-9]{10}\z/'],
            'display_name' => ['required', 'string', 'min:2', 'max:50'],
        ]);

        $meeting = PrmMeeting::query()
            ->where('code', strtoupper($data['code']))
            ->firstOrFail();

        return response()->json(
            $this->meetings->join(
                $meeting,
                $request->user(),
                trim($data['display_name'])
            )
        );
    }

    public function acquireCamera(Request $request, PrmMeeting $meeting): JsonResponse
    {
        return response()->json(
            $this->meetings->acquireCamera($meeting, $request->user())
        );
    }

    public function releaseCamera(Request $request, PrmMeeting $meeting): Response
    {
        $this->meetings->releaseCamera($meeting, $request->user());

        return response()->noContent();
    }

    public function leave(Request $request, PrmMeeting $meeting): Response
    {
        $this->meetings->leave($meeting, $request->user());

        return response()->noContent();
    }

    public function end(Request $request, PrmMeeting $meeting): Response
    {
        $this->meetings->end($meeting, $request->user());

        return response()->noContent();
    }
}
