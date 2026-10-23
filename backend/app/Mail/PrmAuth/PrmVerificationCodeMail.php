<?php

namespace App\Mail\PrmAuth;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PrmVerificationCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $code,
        public int $expireMinutes = 2
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'ATRIANA Verification Code',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "<div style='font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; background-color: #f8fafc;'><div style='max-width: 480px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0;'><h2 style='color: #0f172a; margin-top: 0;'>کد تأیید آتریانا</h2><p style='color: #64748b;'>برای ادامه فرآیند در پلتفرم آتریانا از کد زیر استفاده کنید:</p><div style='font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #ea580c; text-align: center; padding: 20px; background: #fff7ed; border-radius: 12px; margin: 20px 0;'>{$this->code}</div><p style='color: #94a3b8; font-size: 12px; text-align: center;'>این کد به مدت {$this->expireMinutes} دقیقه معتبر است.</p></div></div>",
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
