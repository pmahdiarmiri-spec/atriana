<?php

namespace App\Console\Commands\PrmAdmin;

use App\Services\PrmAdmin\PrmGateKeeperService;
use Illuminate\Console\Command;

class PrmGenerateGateSlugCommand extends Command
{
    protected $signature = 'prm:gate-generate';

    protected $description = 'Generate a new one-time 10-minute admin gate slug for ATRIANA';

    public function handle(PrmGateKeeperService $gateKeeperService): int
    {
        $slug = $gateKeeperService->regenerateSlug();
        $metadata = $gateKeeperService->getSlugMetadata();

        $this->info('ATRIANA One-Time Admin Gate Generated Successfully!');
        $this->line('--------------------------------------------------');
        $this->line('Gate Slug      : ' . $slug);
        $this->line('Expires At     : ' . $metadata['expires_at']);
        $this->line('TTL (Seconds)  : ' . $metadata['remaining_seconds'] . 's (10 Minutes)');
        $this->line('Frontend URL   : http://localhost:3000/fa/prm-gate/' . $slug);
        $this->line('--------------------------------------------------');

        return self::SUCCESS;
    }
}
