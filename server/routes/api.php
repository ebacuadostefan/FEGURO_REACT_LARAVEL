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
    Route::get('/fetchGenders', 'fetchGenders');
    Route::get('/fetchRoles', 'fetchRoles');
    Route::get('/user/show/{user_id}', 'show');
    Route::post('/user/store', 'store');
    Route::post('/user/update/{user_id}', 'update');
    Route::delete('/user/delete/{user_id}', 'destroy');
});