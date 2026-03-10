<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/**
 * Protected API route for authenticated user info.
 * Uses Sanctum's token/session guard via the auth:sanctum middleware.
 */
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
