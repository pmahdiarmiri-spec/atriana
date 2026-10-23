<?php

namespace App\Http\Controllers\Api\PrmSupport;

use App\Enums\PrmSupport\PrmTicketMessageSender;
use App\Enums\PrmSupport\PrmTicketPriority;
use App\Enums\PrmSupport\PrmTicketStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmSupport\PrmStoreTicketMessageRequest;
use App\Http\Requests\PrmSupport\PrmStoreTicketRequest;
use App\Models\PrmTicket;
use App\Models\PrmTicketMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PrmTicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $tickets = PrmTicket::query()
            ->where('user_id', $user->id)
            ->with(['category:id,slug,name_fa,name_en'])
            ->withCount('messages')
            ->orderByDesc('last_reply_at')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'tickets' => $tickets,
        ]);
    }

    public function store(PrmStoreTicketRequest $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $ticket = DB::transaction(function () use ($request, $user) {
            $ticket = PrmTicket::create([
                'user_id' => $user->id,
                'category_id' => $request->integer('category_id'),
                'ticket_number' => PrmTicket::generateTicketNumber(),
                'subject' => trim((string) $request->input('subject')),
                'status' => PrmTicketStatus::OPEN,
                'priority' => PrmTicketPriority::from((string) $request->input('priority')),
                'last_reply_at' => now(),
            ]);

            PrmTicketMessage::create([
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'sender' => PrmTicketMessageSender::USER,
                'message' => trim((string) $request->input('message')),
            ]);

            return $ticket;
        });

        $ticket->load(['category:id,slug,name_fa,name_en', 'messages.user:id,first_name,last_name,name']);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_ticket_created_successfully',
            'ticket' => $ticket,
        ], 201);
    }

    public function show(Request $request, PrmTicket $ticket): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        abort_unless($ticket->user_id === $user->id, 404);

        $ticket->load([
            'category:id,slug,name_fa,name_en',
            'messages.user:id,first_name,last_name,name',
        ]);

        $ticket->messages()
            ->where('sender', PrmTicketMessageSender::ADMIN)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'status' => 'success',
            'ticket' => $ticket,
        ]);
    }

    public function addMessage(PrmStoreTicketMessageRequest $request, PrmTicket $ticket): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        abort_unless($ticket->user_id === $user->id, 404);

        if ($ticket->status === PrmTicketStatus::CLOSED) {
            return response()->json([
                'status' => 'error',
                'code' => 'prm_ticket_is_closed',
            ], 422);
        }

        $message = PrmTicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'sender' => PrmTicketMessageSender::USER,
            'message' => trim((string) $request->input('message')),
        ]);

        $ticket->update([
            'status' => PrmTicketStatus::PENDING_USER,
            'last_reply_at' => now(),
        ]);

        $message->load('user:id,first_name,last_name,name');

        return response()->json([
            'status' => 'success',
            'code' => 'prm_ticket_message_sent',
            'message' => $message,
        ], 201);
    }

    public function close(Request $request, PrmTicket $ticket): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        abort_unless($ticket->user_id === $user->id, 404);

        $ticket->update([
            'status' => PrmTicketStatus::CLOSED,
            'closed_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_ticket_closed',
            'ticket' => $ticket->fresh(['category:id,slug,name_fa,name_en']),
        ]);
    }
}
