<?php

namespace App\Http\Controllers\Api\PrmAdmin\PrmAdChats;

use App\Http\Controllers\Controller;
use App\Models\PrmAdminAuditLog;
use App\Models\PrmAdvertisement;
use App\Models\PrmChat\PrmConversation;
use App\Models\PrmChat\PrmMessageAttachment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PrmAdminAdChatController extends Controller
{
    public function advertisements(Request $request): JsonResponse
    {
        $this->authorizeAccess($request);

        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $search = trim($validated['search'] ?? '');

        $query = PrmAdvertisement::query()->with('images');

        if ($search !== '') {
            $query->where(function ($query) use ($search) {
                $query->where('title', 'like', '%' . $search . '%');

                if (ctype_digit($search)) {
                    $query->orWhere('id', (int) $search);
                }
            });
        }

        $advertisements = $query
            ->orderByDesc('id')
            ->paginate((int) ($validated['per_page'] ?? 15));

        $ids = $advertisements->getCollection()->pluck('id');

        $owners = User::query()
            ->whereIn('id', $advertisements->getCollection()->pluck('user_id'))
            ->with('company')
            ->get()
            ->keyBy('id');

        $counts = PrmConversation::query()
            ->whereIn('advertisement_id', $ids)
            ->selectRaw('advertisement_id, COUNT(*) AS total')
            ->groupBy('advertisement_id')
            ->pluck('total', 'advertisement_id');

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_chat_advertisements_loaded',
            'data' => $advertisements->getCollection()
                ->map(fn (PrmAdvertisement $advertisement): array => array_merge(
                    $this->advertisementData($advertisement),
                    [
                        'owner' => $this->userData($owners->get($advertisement->user_id)),
                        'conversation_count' => (int) ($counts->get($advertisement->id) ?? 0),
                    ]
                ))
                ->values(),
            'meta' => $this->pagination($advertisements),
        ]);
    }

    public function conversations(Request $request, int $advertisement): JsonResponse
    {
        $this->authorizeAccess($request);

        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $ad = PrmAdvertisement::query()->findOrFail($advertisement);
        $search = trim($validated['search'] ?? '');

        $query = PrmConversation::query()
            ->where('advertisement_id', $ad->id)
            ->with(['creator.company', 'recipient.company', 'latestMessage.sender', 'latestMessage.attachment'])
            ->withCount('messages');

        if ($search !== '') {
            $query->where(function ($query) use ($search) {
                $query->whereHas('creator', fn ($user) => $this->searchUser($user, $search))
                    ->orWhereHas('recipient', fn ($user) => $this->searchUser($user, $search));
            });
        }

        $conversations = $query
            ->orderByDesc('last_message_at')
            ->orderByDesc('id')
            ->paginate((int) ($validated['per_page'] ?? 20));

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_advertisement_conversations_loaded',
            'data' => $conversations->getCollection()
                ->map(fn (PrmConversation $conversation): array => $this->conversationData($conversation))
                ->values(),
            'meta' => $this->pagination($conversations),
        ]);
    }

    public function conversation(Request $request, int $conversation): JsonResponse
    {
        $this->authorizeAccess($request);

        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $chat = PrmConversation::query()
            ->with(['advertisement.images', 'creator.company', 'recipient.company'])
            ->withCount('messages')
            ->findOrFail($conversation);

        $messages = $chat->messages()
            ->with(['sender', 'attachment'])
            ->orderByDesc('id')
            ->paginate((int) ($validated['per_page'] ?? 30));

        $this->audit($request, 'admin_ad_chat_viewed', $chat->id, [
            'advertisement_id' => $chat->advertisement_id,
            'page' => $messages->currentPage(),
        ]);

        return response()->json([
            'status' => 'success',
            'code' => 'prm_admin_ad_chat_loaded',
            'advertisement' => $chat->advertisement
                ? $this->advertisementData($chat->advertisement)
                : null,
            'conversation' => $this->conversationData($chat),
            'messages' => $messages->getCollection()
                ->reverse()
                ->values()
                ->map(fn ($message): array => [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $this->displayName($message->sender),
                    'body' => $message->body,
                    'created_at' => $message->created_at?->toIso8601String(),
                    'read_at' => $message->read_at?->toIso8601String(),
                    'attachment' => $message->attachment
                        ? $this->attachmentData($message->attachment)
                        : null,
                ]),
            'meta' => $this->pagination($messages),
        ]);
    }

    public function attachment(Request $request, PrmMessageAttachment $attachment): BinaryFileResponse
    {
        $this->authorizeAccess($request);

        $attachment->load('message.conversation');

        abort_unless($attachment->message?->conversation, 404);
        abort_unless(
            $attachment->disk === 'local'
                && str_starts_with($attachment->path, 'prm-chat/'),
            404
        );

        $disk = Storage::disk('local');

        abort_unless($disk->exists($attachment->path), 404);

        $this->audit(
            $request,
            'admin_ad_chat_attachment_downloaded',
            $attachment->message->conversation_id,
            ['attachment_id' => $attachment->id]
        );

        return response()->download(
            $disk->path($attachment->path),
            'attachment-' . $attachment->id,
            [
                'Content-Type' => 'application/octet-stream',
                'Cache-Control' => 'private, no-store',
                'X-Content-Type-Options' => 'nosniff',
            ]
        );
    }

   private function authorizeAccess(Request $request): void
{
    $user = $request->user();

    abort_unless($user, 401);

    $role = $user->role;

    if ($role instanceof \App\Enums\PrmAdmin\PrmUserRole) {
        if ($role->isSuperAdmin()) {
            return;
        }

        if (!$role->isAdmin()) {
            abort(403, 'دسترسی فقط برای مدیران مجاز است.');
        }
    } else {
        $roleValue = is_object($role) && property_exists($role, 'value')
            ? $role->value
            : $role;

        if ($roleValue === \App\Enums\PrmAdmin\PrmUserRole::SUPER_ADMIN->value) {
            return;
        }

        if ($roleValue !== \App\Enums\PrmAdmin\PrmUserRole::ADMIN->value) {
            abort(403, 'دسترسی فقط برای مدیران مجاز است.');
        }
    }

    $permissions = $user->permissions;

    if ($permissions instanceof \Illuminate\Support\Collection) {
        $permissions = $permissions->all();
    }

    if (is_string($permissions)) {
        $permissions = json_decode($permissions, true);
    }

    abort_unless(
        is_array($permissions)
            && in_array('ads.manage', $permissions, true),
        403,
        'شما مجوز مدیریت آگهی‌ها (ads.manage) را ندارید.'
    );
}


    private function searchUser($query, string $search): void
    {
        $query->where(function ($query) use ($search) {
            $query->where('first_name', 'like', '%' . $search . '%')
                ->orWhere('last_name', 'like', '%' . $search . '%')
                ->orWhere('email', 'like', '%' . $search . '%')
                ->orWhere('mobile', 'like', '%' . $search . '%');
        });
    }

    private function advertisementData(PrmAdvertisement $advertisement): array
    {
        $image = $advertisement->images->first();

        return [
            'id' => $advertisement->id,
            'title' => $advertisement->title,
            'slug' => $advertisement->slug,
            'price' => $advertisement->price,
            'currency' => $advertisement->currency,
            'image_url' => $image?->path ? url('storage/' . $image->path) : null,
        ];
    }

    private function conversationData(PrmConversation $conversation): array
    {
        $latest = $conversation->relationLoaded('latestMessage')
            ? $conversation->latestMessage
            : null;

        return [
            'id' => $conversation->id,
            'advertisement_id' => $conversation->advertisement_id,
            'creator' => $this->userData($conversation->creator),
            'recipient' => $this->userData($conversation->recipient),
            'message_count' => (int) $conversation->messages_count,
            'last_message_at' => $conversation->last_message_at?->toIso8601String(),
            'created_at' => $conversation->created_at?->toIso8601String(),
            'last_message' => $latest ? [
                'id' => $latest->id,
                'sender_id' => $latest->sender_id,
                'body' => $latest->body,
                'created_at' => $latest->created_at?->toIso8601String(),
                'attachment' => $latest->attachment
                    ? $this->attachmentData($latest->attachment)
                    : null,
            ] : null,
        ];
    }

    private function attachmentData(PrmMessageAttachment $attachment): array
    {
        return [
            'id' => $attachment->id,
            'kind' => $attachment->kind,
            'name' => $attachment->name,
            'mime' => $attachment->mime,
            'size' => (int) $attachment->size,
        ];
    }

    private function displayName(?User $user): string
    {
        if (!$user) {
            return 'کاربر حذف‌شده';
        }

        return trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? ''))
            ?: ($user->name ?? 'کاربر آتریانا');
    }

    private function userData(?User $user): ?array
    {
        if (!$user) {
            return null;
        }

        return [
            'id' => $user->id,
            'name' => $this->displayName($user),
            'email' => $user->email,
            'mobile' => $user->mobile,
            'company_name' => $user->company?->name_fa
                ?? $user->company?->name_en
                ?? null,
        ];
    }

    private function pagination($paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'total' => $paginator->total(),
        ];
    }

    private function audit(
        Request $request,
        string $action,
        int $conversationId,
        array $payload
    ): void {
        PrmAdminAuditLog::query()->create([
            'user_id' => $request->user()->id,
            'action' => $action,
            'target_type' => PrmConversation::class,
            'target_id' => $conversationId,
            'payload' => $payload,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
