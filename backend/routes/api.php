<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

// Proxy routes for ip-api.com — avoids browser CORS restrictions
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Get current server/user IP geo
    Route::get('/geo', function () {
        $response = Http::get('http://ip-api.com/json');
        return response()->json($response->json(), $response->status());
    });

    // Get geo for a specific IP
    Route::get('/geo/{ip}', function (string $ip) {
        $response = Http::get("http://ip-api.com/json/{$ip}");
        return response()->json($response->json(), $response->status());
    });
});
