<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/login', [AuthController::class, 'login'])->middleware(['throttle:login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('throttle:api')->group(function () {
    // Api Resource
    Route::apiResource('/users', UserController::class)->middleware('auth:sanctum');
});
