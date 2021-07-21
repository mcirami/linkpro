<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PageController;

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

Route::group(['middleware' => ['CORS']], function() {
        /*Route::post('/links/new', [LinkController::class, 'store']);
        Route::post('/links/{link}', [LinkController::class, 'update']);
        Route::delete('/links/{link}', [LinkController::class, 'destroy']);*/


        //Route::post('/page/header-update', [PageController::class, 'headerUpdate'])->name('page.header.update');
        //Route::post('page/profile-update', [PageController::class, 'profileUpdate'])->name('page.profile.update');
        //Route::post('/page/name-update/{page}', [PageController::class, 'nameUpdate'])->name('page.name.update');

    }
);
