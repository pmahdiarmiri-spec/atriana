<?php

namespace App\Http\Requests\PrmChat;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PrmSendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $kind = $this->input('kind');

        $mimeTypes = match ($kind) {
            'image' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            'pdf' => ['application/pdf'],
            'video' => ['video/mp4', 'video/webm'],
            'voice' => ['audio/webm', 'video/webm', 'audio/ogg', 'application/ogg', 'audio/mp4', 'video/mp4'],
            default => [],
        };

        $maxKilobytes = match ($kind) {
            'image', 'voice' => 10240,
            'pdf' => 20480,
            default => 51200,
        };

        $fileRules = [
            'required_without:body',
            'file',
            'max:' . $maxKilobytes,
        ];

        if ($mimeTypes !== []) {
            $fileRules[] = 'mimetypes:' . implode(',', $mimeTypes);
        }

        return [
            'body' => ['nullable', 'required_without:file', 'string', 'max:5000'],
            'kind' => ['required_with:file', Rule::in(['image', 'pdf', 'video', 'voice'])],
            'file' => $fileRules,
        ];
    }
}
