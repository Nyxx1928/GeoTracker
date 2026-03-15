<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [env('FRONTEND_ORIGIN', 'https://geo-tracker-eight-blond.vercel.app')],
    
    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' =>0,

    'supports_credentials' => true,
];