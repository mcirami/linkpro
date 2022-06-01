<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\IconController;
use App\Http\Controllers\UtilityController;
use App\Http\Controllers\WebhookController;
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

Route::group(['prefix' => 'admin'], function () {
    Voyager::routes();

    Route::post('/subscriptions', [App\Http\Controllers\VoyagerFilterController::class, 'index']);
    Route::post('/users', [App\Http\Controllers\VoyagerFilterController::class, 'index']);
    Route::post('/pages', [App\Http\Controllers\VoyagerFilterController::class, 'index']);
    Route::post('/links', [App\Http\Controllers\VoyagerFilterController::class, 'index']);
    Route::post('/referrals', [App\Http\Controllers\VoyagerFilterController::class, 'index']);
});

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
    Route::get('/page/get-links/{page}', [LinkController::class, 'getPageLinks'])->name('page.get.links');

    Route::get('/pages/folder/links/{folder}', [FolderController::class, 'getFolderLinks'])->name('get.folder.links');
    Route::post('/folder/status/{folder}', [FolderController::class, 'updateFolderStatus']);
    Route::post('/folder/delete/{folder}', [FolderController::class, 'destroy']);
    Route::post('/folder/update-name/{folder}', [FolderController::class, 'updateName']);
});

Route::group(['middleware' => 'auth'], function() {

    Route::get('/register/step-two', [PageController::class, 'showCreatePage'])->name('create.page');
    Route::get('/email-test', [MailController::class, 'sendEmail']);

    Route::post('/subscribe/create', [SubscriptionController::class, 'store'])->name('subscribe.post');
    Route::post('/subscribe/cancel', [SubscriptionController::class, 'cancel'])->name('subscribe.cancel');
    Route::post('/subscribe/resume', [SubscriptionController::class, 'resume'])->name('subscribe.resume');
    Route::post('/subscribe/check-code', [SubscriptionController::class, 'checkCode'])->name('check.code');
    Route::post('/change-plan', [SubscriptionController::class, 'changePlan'])->name('subscribe.change.plan');

    Route::post('/update-account/{user}', [UserController::class, 'updateAccountInfo'])->name('user.update.info');
    Route::post('/update-card', [UserController::class, 'updateCard'])->name('user.update.card');
    Route::post('/update-payment-method', [UserController::class, 'updateMethod'])->name('user.update.payment');

    Route::post('/stats/link/range', [TrackingController::class, 'getLinkStatsRange']);
    Route::post('/stats/page/range', [TrackingController::class, 'getPageStatsRange']);
    Route::post('/stats/folder/range', [TrackingController::class, 'getFolderStatsRange']);
    Route::get('/stats/get/page', [TrackingController::class, 'getPageStats']);
    Route::get('/stats/get/link', [TrackingController::class, 'getLinkStats']);
    Route::get('/stats/get/deleted', [TrackingController::class, 'getDeletedStats']);
    Route::get('/stats/get/folder', [TrackingController::class, 'getFolderStats']);
    Route::get('/stats', [TrackingController::class, 'show'])->name('stats');

    Route::post('/folder/new', [FolderController::class, 'store'])->name('add.folder');

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

Route::group(['middleware' => 'web'], function() {

    Route::post('/braintree/webhooks/subscription-expired', [WebhookController::class, 'subscriptionExpired']);
    Route::post('/braintree/webhooks/charged-successfully', [WebhookController::class, 'chargedSuccessfully']);

    Route::get('/get-icons', [IconController::class, 'getIcons']);

    Route::view('/','home')->name('guest-home');
    Route::view('/terms-and-conditions', 'utility.terms')->name('terms');
    Route::view('/privacy-policy', 'utility.privacy')->name('privacy');
    Route::view('/how-it-works', 'utility.how-it-works')->name('how-it-works');
    Route::view('/plan-options', 'subscription.public-plans')->name('public.plans');
    Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

    Route::post('/check-page-auth/{page}', [PageController::class, 'pageAuth'])->name('check.page.auth');
    Route::get('/email-subscription/{user}', [UserController::class, 'emailSubscription'])->name('email.subscription');
    Route::post('/link-click/{link}', [TrackingController::class, 'storeLinkVisit']);
    Route::post('/folder-click/{folder}', [TrackingController::class, 'storeFolderClick']);
    Route::get('/setup', [UtilityController::class, 'showSetupPage'])->name('setup.page');
    Route::get('/{page}', [PageController::class, 'show']);
});


