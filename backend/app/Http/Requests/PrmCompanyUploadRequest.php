<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PrmCompanyUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', 'in:logo,cover,catalog,resume,gallery,certs'],
            'file' => ['required_without:files', 'nullable', 'file', 'max:20480'],
            'files' => ['required_without:file', 'nullable', 'array', 'max:10'],
            'files.*' => ['file', 'max:20480'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'نوع فایل مشخص نشده است.',
            'type.in' => 'نوع فایل معتبر نیست.',
            'file.max' => 'حداکثر حجم مجاز هر فایل ۲۰ مگابایت است.',
            'files.*.max' => 'حداکثر حجم مجاز هر یک از فایل‌ها ۲۰ مگابایت است.',
            'files.max' => 'حداکثر ۱۰ فایل را می‌توانید به صورت همزمان ارسال کنید.',
        ];
    }
}
