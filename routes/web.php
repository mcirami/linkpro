<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\VisitController;
use App\Http\Controllers\PageController;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Auth::routes();

// laravel-links.com/dashboard
Route::group(['middleware' => 'auth', 'prefix' => 'dashboard'], function() {

    //Route::get('/links', [LinkController::class, 'index']);
    Route::get('/links/new', [LinkController::class, 'create']);
    Route::post('/links/new', [LinkController::class, 'store']);
    //Route::get('/links/{link}', [LinkController::class, 'edit']);
    Route::post('/links/{link}', [LinkController::class, 'update']);
    Route::post('/links/status/{link}', [LinkController::class, 'updateStatus']);
    Route::delete('/links/{link}', [LinkController::class, 'destroy']);

    Route::get('/pages/{page}', [PageController::class, 'edit'])
        ->name('pages.edit')
        ->missing(function (Request $request) {
            $user = Auth::user();
            $page = $user->pages()->first()->pluck('id');
    });

    Route::post('/page/header-update/{page}', [PageController::class, 'headerUpdate'])->name('page.header.update');
    Route::post('/page/name-update/{page}', [PageController::class, 'nameUpdate'])->name('page.name.update');
    Route::post('/page/profile-update/{page}', [PageController::class, 'profileUpdate'])->name('page.profile.update');
    Route::post('/page/new', [PageController::class, 'store'])->name('page.new');

    Route::get('/appearance', [UserController::class, 'edit']);
    Route::post('/appearance', [UserController::class, 'update']);
});


Route::post('/visit/{link}', [VisitController::class, 'store']);

// laravel-links.com/page
Route::get('/{page}', [PageController::class, 'show']);


