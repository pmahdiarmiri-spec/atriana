<?php

namespace App\Http\Controllers\Api\PrmCompanies\User\MyCompany;

use App\Enums\PrmCompanies\PrmCompanyStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrmCompanyUploadRequest;
use App\Http\Resources\PrmCompanies\PrmCompanyResource;
use App\Models\PrmCompany;
use App\Services\PrmUploads\PrmCompanyUploads\PrmCompanyUploadService;
use Illuminate\Http\JsonResponse;

class PrmMyCompanyUploadController extends Controller
{
    public function __construct(
        private readonly PrmCompanyUploadService $uploadService
    ) {
    }

    public function __invoke(PrmCompanyUploadRequest $request): JsonResponse
    {
        $user = $request->user();

        $company = PrmCompany::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'name_fa' => 'پیش‌نویس شرکت',
                'status' => PrmCompanyStatus::DRAFT,
            ]
        );

        if (!in_array($company->status, [PrmCompanyStatus::DRAFT, PrmCompanyStatus::NEEDS_EDIT], true)) {
            abort(422, 'امکان بارگذاری مدارک در این وضعیت وجود ندارد.');
        }

        $type = $request->validated('type');

        if (in_array($type, ['gallery', 'certs'], true)) {
            $files = $request->file('files');
            if (!$files && $request->hasFile('file')) {
                $files = [$request->file('file')];
            }
            $field = $type === 'gallery' ? 'gallery_paths' : 'cert_paths';
            $company = $this->uploadService->uploadMultiple($user, $company, $field, $files ?: []);
        } else {
            $file = $request->file('file');
            if (!$file) {
                abort(422, 'فایلی جهت بارگذاری یافت نشد.');
            }
            $field = "{$type}_path";
            $company = $this->uploadService->uploadSingle($user, $company, $field, $file);
        }

        return response()->json([
            'status' => 'success',
            'code' => 'prm_company_file_uploaded',
            'company' => new PrmCompanyResource($company->load(['industry'])),
        ]);
    }
}
