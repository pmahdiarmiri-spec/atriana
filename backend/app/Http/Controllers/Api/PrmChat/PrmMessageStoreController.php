<?php

namespace App\Http\Controllers\Api\PrmChat;

use App\Events\PrmChat\PrmMessageSentEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmChat\PrmSendMessageRequest;
use App\Http\Resources\PrmChat\PrmMessageResource;
use App\Models\PrmChat\PrmConversation;
use App\Models\PrmChat\PrmMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

class PrmMessageStoreController extends Controller
{
    public function __invoke(PrmSendMessageRequest $request, int $id): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        $conversation = PrmConversation::query()->findOrFail($id);

        if (!$conversation->isParticipant($user->id)) {
            return response()->json([
                'status' => 'error',
                'code' => 'prm_chat_forbidden',
                'message' => 'شما اجازه ارسال پیام در این گفتگو را ندارید.',
            ], 403);
        }

        $file = $request->file('file');
        $path = null;

        try {
            if ($file) {
                $path = $file->store('prm-chat/' . $conversation->id, 'local');

                if (!is_string($path)) {
                    throw new RuntimeException('Chat attachment could not be stored.');
                }
            }

            $message = DB::transaction(function () use ($conversation, $user, $validated, $file, $path): PrmMessage {
                $sentAt = now();

                $message = PrmMessage::create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $user->id,
                    'body' => $validated['body'] ?? null,
                    'created_at' => $sentAt,
                ]);

                if ($file && $path) {
                    $name = basename(str_replace('\\', '/', $file->getClientOriginalName()));

                    $message->attachment()->create([
                        'kind' => $validated['kind'],
                        'disk' => 'local',
                        'path' => $path,
                        'name' => mb_substr($name, 0, 255),
                        'mime' => $file->getMimeType(),
                        'size' => $file->getSize(),
                    ]);
                }

                $conversation->update([
                    'last_message_at' => $sentAt,
                ]);

                return $message;
            });
        } catch (Throwable $exception) {
            if ($path !== null) {
                Storage::disk('local')->delete($path);
            }

            throw $exception;
        }

        $message->load(['sender', 'attachment']);

        broadcast(new PrmMessageSentEvent($message))->toOthers();

        return response()->json([
            'status' => 'success',
            'code' => 'prm_message_created',
            'data' => new PrmMessageResource($message),
        ], 201);
    }
}
