<?php

return [

    'postmark' => [
        'token' => env('POSTMARK_USAGE_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'payamak' => [
        'username' => env('SMS_USERNAME'),
        'password' => env('SMS_PASSWORD'),
        'pattern_id' => env('SMS_PATTERN_ID'),
        'api_url' => env('SMS_API_URL', 'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber'),
    ],

];
