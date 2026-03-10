<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();

        // Exclude XSRF-TOKEN from encryption so axios can read it as plain text
        $middleware->encryptCookies(except: ['XSRF-TOKEN']);

        // Login/logout don't need CSRF — credentials authenticate them, not session state
        $middleware->validateCsrfTokens(except: [
            'api/login',
            'api/logout',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
