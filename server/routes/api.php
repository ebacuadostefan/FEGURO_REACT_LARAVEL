<?php
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;


Route::controller(AuthController::class)->group( function() {
    Route::post('/login', 'login');
    Route::post('/logout', 'logout')->middleware('auth:sanctum');
});

Route::controller(UserController::class)->group( function() {
    Route::get('/fetchUsers', 'fetchUsers');
});