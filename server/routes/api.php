<?php
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;


Route::controller(AuthController::class)->group( function() {
    Route::post('/login', 'login');
    Route::post('/logout', 'logout')->middleware(['auth:sanctum', 'check.token.expiration']);
});

Route::controller(UserController::class)->middleware(['auth:sanctum', 'check.token.expiration'])->group( function() {
    Route::get('/fetchUsers', 'fetchUsers');
});