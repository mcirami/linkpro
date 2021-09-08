<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\VisitController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\MailController;
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
    return view('home');
});

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Auth::routes();

// laravel-links.com/dashboard
Route::group(['middleware' => 'auth', 'prefix' => 'dashboard'], function() {

    //Route::get('/links', [LinkController::class, 'index']);
    //Route::get('/links/new', [LinkController::class, 'create']);
    Route::post('/links/new', [LinkController::class, 'store']);
    //Route::get('/links/{link}', [LinkController::class, 'edit']);
    Route::post('/links/update/{link}', [LinkController::class, 'update']);
    Route::post('/links/status/{link}', [LinkController::class, 'updateStatus']);
    Route::post('/links/update-positions', [LinkController::class, 'updatePositions']);
    Route::delete('/links/{link}', [LinkController::class, 'destroy']);

    Route::get('/pages/{page}', [PageController::class, 'edit'])->name('pages.edit');
    Route::get('/pages', [PageController::class, 'redirect']);
    Route::get('/', [PageController::class, 'redirect']);

    Route::post('/page/new', [PageController::class, 'store'])->name('page.new');
    Route::post('/page/update-header-image/{page}', [PageController::class, 'updateHeaderImage'])->name('page.header.update');
    Route::post('/page/update-profile-image/{page}', [PageController::class, 'updateProfileImage'])->name('page.profile.update');
    Route::post('/page/update-name/{page}', [PageController::class, 'updateName'])->name('page.name.update');
    Route::post('/page/update-title/{page}', [PageController::class, 'updateTitle'])->name('page.title.update');
    Route::post('/page/update-password/{page}', [PageController::class, 'updatePassword'])->name('page.password.update');
    Route::post('/page/update-bio/{page}', [PageController::class, 'updateBio'])->name('page.bio.update');

    Route::get('/appearance', [UserController::class, 'edit']);
    Route::post('/appearance', [UserController::class, 'update']);


});

Route::group(['middleware' => 'auth'], function() {
    Route::get('/upgrade', [SubscriptionController::class, 'upgrade'])->name('upgrade.get');
    Route::get('/subscribe', [SubscriptionController::class, 'show']);
    Route::post('/subscribe', [SubscriptionController::class, 'store'])->name('subscribe.post');

    Route::get('/email', [MailController::class, 'sendEmail']);
});

Route::post('/visit/{link}', [VisitController::class, 'store']);

// link.pro/page
Route::get('/{page}', [PageController::class, 'show']);
Route::post('/check-page-auth/{page}', [PageController::class, 'pageAuth'])->name('check.page.auth');

// route for mailing

