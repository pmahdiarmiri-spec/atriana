<?php

namespace App\Http\Controllers\Api\PrmChat;

use App\Http\Controllers\Controller;
use App\Models\PrmChat\PrmMessageAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PrmChatAttachmentShowController extends Controller
{
    public function __invoke(Request $request, PrmMessageAttachment $attachment): BinaryFileResponse
    {
        $attachment->load('message.conversation');

        abort_unless(
            $attachment->message->conversation->isParticipant($request->user()->id),
            403
        );

        $disk = Storage::disk($attachment->disk);

        abort_unless($disk->exists($attachment->path), 404);

        return response()->file($disk->path($attachment->path), [
            'Content-Type' => $attachment->mime,
            'Content-Disposition' => 'inline',
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
