<?php

namespace App\Services\PrmAdmin;

use Illuminate\Http\Request;

class PrmAdminSecurityTelemetryService
{
    public function captureContext(?Request $request = null, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        $req = $request ?? request();
        $ua = $userAgent ?? $req->userAgent() ?? 'Unknown';
        $ip = $ipAddress ?? $req->ip() ?? '0.0.0.0';

        return [
            'ip_address' => $ip,
            'forwarded_ips' => $req->ips(),
            'cf_connecting_ip' => $req->header('CF-Connecting-IP'),
            'x_real_ip' => $req->header('X-Real-IP'),
            'user_agent_raw' => $ua,
            'os_platform' => $this->detectOperatingSystem($ua),
            'browser' => $this->detectBrowser($ua),
            'device_type' => $this->detectDeviceType($ua),
            'sec_ch_ua' => $req->header('Sec-CH-UA'),
            'sec_ch_ua_platform' => $req->header('Sec-CH-UA-Platform'),
            'sec_ch_ua_mobile' => $req->header('Sec-CH-UA-Mobile'),
            'accept_language' => $req->header('Accept-Language'),
            'origin' => $req->header('Origin'),
            'referer' => $req->header('Referer'),
            'request_path' => $req->path(),
            'request_method' => $req->method(),
            'authenticated_at_iso' => now()->toIso8601String(),
            'authenticated_at_unix' => now()->timestamp,
            'timezone' => config('app.timezone'),
        ];
    }

    private function detectOperatingSystem(string $ua): string
    {
        $uaLower = strtolower($ua);

        return match (true) {
            str_contains($uaLower, 'windows nt 10.0') => 'Windows 10/11',
            str_contains($uaLower, 'windows nt 6.3') => 'Windows 8.1',
            str_contains($uaLower, 'windows nt 6.2') => 'Windows 8',
            str_contains($uaLower, 'windows nt 6.1') => 'Windows 7',
            str_contains($uaLower, 'macintosh') || str_contains($uaLower, 'mac os x') => 'macOS',
            str_contains($uaLower, 'iphone') => 'iOS (iPhone)',
            str_contains($uaLower, 'ipad') => 'iPadOS (iPad)',
            str_contains($uaLower, 'android') => 'Android',
            str_contains($uaLower, 'ubuntu') => 'Linux (Ubuntu)',
            str_contains($uaLower, 'linux') => 'Linux',
            default => 'Unknown OS',
        };
    }

    private function detectBrowser(string $ua): string
    {
        $uaLower = strtolower($ua);

        return match (true) {
            str_contains($uaLower, 'edg/') || str_contains($uaLower, 'edge/') => 'Microsoft Edge',
            str_contains($uaLower, 'opr/') || str_contains($uaLower, 'opera') => 'Opera',
            str_contains($uaLower, 'chrome/') && ! str_contains($uaLower, 'edg/') => 'Google Chrome',
            str_contains($uaLower, 'firefox/') => 'Mozilla Firefox',
            str_contains($uaLower, 'safari/') && ! str_contains($uaLower, 'chrome/') => 'Apple Safari',
            str_contains($uaLower, 'postman') => 'Postman Client',
            str_contains($uaLower, 'curl/') => 'cURL CLI',
            default => 'Unknown Browser',
        };
    }

    private function detectDeviceType(string $ua): string
    {
        $uaLower = strtolower($ua);

        if (str_contains($uaLower, 'ipad') || str_contains($uaLower, 'tablet')) {
            return 'Tablet';
        }

        if (str_contains($uaLower, 'mobile') || str_contains($uaLower, 'iphone') || str_contains($uaLower, 'android')) {
            return 'Mobile';
        }

        return 'Desktop';
    }
}
