<?php

namespace App\Services\PrmUploads\PrmCompanyUploads;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class PrmCompanyUploadPathService
{
    public function generatePath(int $userId, string $type, UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: 'bin');
        $randomName = Str::random(40) . '.' . $extension;

        return "prm/companies/{$userId}/{$type}/{$randomName}";
    }
}
