<?php

namespace App\Services\PrmCompanies\PrmCompanyRegistration;

class PrmCompanyRegistrationPriceService
{
    public function getRegistrationPriceRials(): int
    {
        return 1000000;
    }

    public function getRenewalPriceRials(): int
    {
        return (int) round($this->getRegistrationPriceRials() * 0.30);
    }
}
