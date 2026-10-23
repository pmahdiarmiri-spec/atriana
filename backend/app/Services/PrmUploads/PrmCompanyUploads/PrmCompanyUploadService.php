<?php

namespace App\Services\PrmUploads\PrmCompanyUploads;

use App\Models\PrmCompany;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PrmCompanyUploadService
{
    private const DISK = 'public';

    public function __construct(
        private readonly PrmCompanyUploadPathService $pathService
    ) {
    }

    public function uploadSingle(User $user, PrmCompany $company, string $field, UploadedFile $file): PrmCompany
    {
        $oldPath = $company->{$field};
        if ($oldPath && Storage::disk(self::DISK)->exists($oldPath)) {
            Storage::disk(self::DISK)->delete($oldPath);
        }

        $type = str_replace('_path', '', $field);
        $newPath = $this->pathService->generatePath($user->id, $type, $file);

        Storage::disk(self::DISK)->putFileAs(
            dirname($newPath),
            $file,
            basename($newPath)
        );

        $company->{$field} = $newPath;
        $company->save();

        return $company->refresh();
    }

    public function uploadMultiple(User $user, PrmCompany $company, string $field, array $files): PrmCompany
    {
        $currentPaths = is_array($company->{$field}) ? $company->{$field} : [];
        $type = str_replace('_paths', '', $field);

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $newPath = $this->pathService->generatePath($user->id, $type, $file);
                Storage::disk(self::DISK)->putFileAs(
                    dirname($newPath),
                    $file,
                    basename($newPath)
                );
                $currentPaths[] = $newPath;
            }
        }

        $company->{$field} = array_values(array_unique($currentPaths));
        $company->save();

        return $company->refresh();
    }
}
