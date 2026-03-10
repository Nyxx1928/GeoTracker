<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Http\Controllers\AuthController;

// Simple JSON API endpoints using session-based auth (web middleware)
Route::prefix('api')->group(function () {
    Route::get('csrf-token', [AuthController::class, 'csrfToken']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
});
