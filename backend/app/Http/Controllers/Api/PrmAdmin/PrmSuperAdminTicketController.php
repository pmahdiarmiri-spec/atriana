<?php

namespace App\Http\Controllers\Api\PrmAdmin;

use App\Enums\PrmSupport\PrmTicketMessageSender;
use App\Enums\PrmSupport\PrmTicketStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmSupport\PrmStoreTicketMessageRequest;
use App\Models\PrmTicket;
use App\Models\PrmTicketMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PrmSuperAdminTicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tickets = PrmTicket::query()
            ->with(['category:id,slug,name_fa,name_en', 'user:id,first_name,last_name,name,email,mobile'])
            ->withCount('messages')
            ->when($request->filled('status'), fn ($query) => $query->where('status', (string) $request->input('status')))
            ->when($request->filled('priority'), fn ($query) => $query->where('priority', (string) $request->input('priority')))
            ->orderByRaw("CASE status WHEN 'open' THEN 0 WHEN 'pending_user' THEN 1 ELSE 2 END")
            ->orderByDesc('priority')
            ->orderByDesc('last_reply_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'tickets' => $tickets,
        ]);
    }

    public function show(PrmTicket $ticket): JsonResponse
    {
        $ticket->load([
            'category:id,slug,name_fa,name_en',
            'user:id,first_name,last_name,name,email,mobile',
            'messages.user:id,first_name,last_name,name',
        ]);

        return response()->json([
            'status' => 'success',
            'ticket' => $ticket,
        ]);
    }

    public function reply(PrmStoreTicketMessageRequest $request, PrmTicket $ticket): JsonResponse
    {
        $admin = $request->user();

        $message = PrmTicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $admin->id,
            'sender' => PrmTicketMessageSender::ADMIN,
            'message' => trim((string) $request->input('message')),
        ]);

        $ticket->update([
            'status' => PrmTicketStatus::ANSWERED,
            'last_reply_at' => now(),
        ]);

        $message->load('user:id,first_name,last_name,name');

        return response()->json([
            'status' => 'success',
            'code' => 'prm_super_admin_ticket_reply_sent',
            'message' => $message,
        ], 201);
    }

    public function updateStatus(Request $request, PrmTicket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::enum(PrmTicketStatus::class)],
        ]);

        $status = PrmTicketStatus::from($validated['status']);

        $ticket->update([
            'status' => $status,
            'closed_at' => $status === PrmTicketStatus::CLOSED ? now() : null,
        ]);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_super_admin_ticket_status_updated',
            'ticket' => $ticket->fresh(['category:id,slug,name_fa,name_en']),
        ]);
    }
}
