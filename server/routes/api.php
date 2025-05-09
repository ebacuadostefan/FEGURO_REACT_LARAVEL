<?php
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;


Route::controller(UserController::class)->group( function() {
    Route::get('/fetchUsers', 'fetchUsers');
});