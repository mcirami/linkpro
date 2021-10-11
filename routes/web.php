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
})->name('guest-home');

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Auth::routes();

// laravel-links.com/dashboard
Route::group(['middleware' => 'auth', 'prefix' => 'dashboard'], function() {

    Route::post('/links/new', [LinkController::class, 'store']);
    Route::post('/links/update/{link}', [LinkController::class, 'update']);
    Route::post('/links/status/{link}', [LinkController::class, 'updateStatus']);
    Route::post('/links/update-positions', [LinkController::class, 'updatePositions']);
    Route::post('/links/delete/{link}', [LinkController::class, 'destroy']);
    Route::post('/page/new', [PageController::class, 'store'])->name('page.new');
    Route::post('/page/update-header-image/{page}', [PageController::class, 'updateHeaderImage'])->name('page.header.update');
    Route::post('/page/update-profile-image/{page}', [PageController::class, 'updateProfileImage'])->name('page.profile.update');
    Route::post('/page/update-name/{page}', [PageController::class, 'updateName'])->name('page.name.update');
    Route::post('/page/update-title/{page}', [PageController::class, 'updateTitle'])->name('page.title.update');
    Route::post('/page/update-password/{page}', [PageController::class, 'updatePassword'])->name('page.password.update');
    Route::post('/page/update-bio/{page}', [PageController::class, 'updateBio'])->name('page.bio.update');

});

Route::group(['middleware' => 'auth'], function() {

    Route::get('/register/step-two', [PageController::class, 'showCreatePage'])->name('create.page');
    Route::get('/email', [MailController::class, 'sendEmail']);

    Route::post('/subscribe/create', [SubscriptionController::class, 'store'])->name('subscribe.post');
    Route::post('/subscribe/cancel', [SubscriptionController::class, 'cancel'])->name('subscribe.cancel');
    Route::post('/subscribe/resume', [SubscriptionController::class, 'resume'])->name('subscribe.resume');
    Route::post('/change-plan', [SubscriptionController::class, 'changePlan'])->name('subscribe.change.plan');

    Route::post('/update-account/{user}', [UserController::class, 'updateAccountInfo'])->name('user.update.info');
    Route::post('/update-card', [UserController::class, 'updateCard'])->name('user.update.card');
    Route::post('/update-payment-method', [UserController::class, 'updateMethod'])->name('user.update.payment');

});

Route::group(['middleware' => ['auth', 'EnsureLinkIsCreated'], 'prefix' => 'dashboard'], function() {
    Route::get('/pages/{page}', [PageController::class, 'edit'])->name('pages.edit');
    Route::get('/pages', [PageController::class, 'redirect']);
    Route::get('/', [PageController::class, 'redirect'])->name('dashboard');
});

Route::group(['middleware' => ['auth', 'EnsureLinkIsCreated']], function() {
    Route::get('/edit-account', [UserController::class, 'edit'])->name('user.edit');
    Route::get('/plans', [SubscriptionController::class, 'plans'])->name('plans.get');
    Route::get('/subscribe', [SubscriptionController::class, 'purchase'])->name('subscribe.get');
});

Route::post('/visit/{link}', [VisitController::class, 'store']);

// link.pro/page
Route::get('/{page}', [PageController::class, 'show']);
Route::post('/check-page-auth/{page}', [PageController::class, 'pageAuth'])->name('check.page.auth');

