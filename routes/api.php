<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/links/new', [LinkController::class, 'store']);
Route::post('/links/{link}', [LinkController::class, 'update']);
Route::delete('/links/{link}', [LinkController::class, 'destroy']);

Route::post('/links/header', [PageController::class, 'headerUpload']);


