<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\IconController;
use App\Http\Controllers\UtilityController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\ContactMailController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\MailchimpController;
use App\Http\Controllers\ShopifyController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\CourseRegisterController;
use App\Http\Controllers\Auth\CoursePasswordController;

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

Route::group(['middleware' => 'auth'], function() {

    Route::get('/edit-account', [UserController::class, 'edit'])->name('user.edit');

    Route::get('/register/create-page', [PageController::class, 'showCreatePage'])->name('create.page');
    Route::get('/email-test', [MailController::class, 'sendEmail']);

    Route::post('/subscribe/create', [SubscriptionController::class, 'store'])->name('subscribe.post');
    Route::post('/subscribe/cancel', [SubscriptionController::class, 'cancel'])->name('subscribe.cancel');
    Route::post('/subscribe/resume', [SubscriptionController::class, 'resume'])->name('subscribe.resume');
    Route::post('/subscribe/check-code', [SubscriptionController::class, 'checkCode'])->name('check.code');
    Route::post('/change-plan', [SubscriptionController::class, 'changePlan'])->name('subscribe.change.plan');

    Route::post('/update-account/{user}', [UserController::class, 'updateAccountInfo'])->name('user.update.info');
    Route::post('/update-card', [UserController::class, 'updateCard'])->name('user.update.card');
    Route::post('/update-payment-method', [UserController::class, 'updateMethod'])->name('user.update.payment');

    Route::post('/folder/new', [FolderController::class, 'store'])->name('add.folder');

    Route::get('/auth/shopify', [ShopifyController::class, 'auth'])->name('shopify.auth');
    Route::get('/auth/shopify/callback', [ShopifyController::class, 'callback']);
    Route::get('/shopify/get-products/{id}', [ShopifyController::class, 'getAllProducts'])->name('shopify.get.products');
    Route::get('/shopify/get-stores', [ShopifyController::class, 'getStores'])->name('shopify.get.stores');

    Route::get('/auth/mailchimp', [MailchimpController::class, 'auth'])->name('mailchimp.auth');
    Route::get('/auth/mailchimp/callback', [MailchimpController::class, 'callback']);
    Route::get('/mailchimp/list', [MailchimpController::class, 'getLists'])->name('mailchimp.get.lists');
    Route::post('/mailchimp/remove-connection', [MailchimpController::class, 'removeConnection'])->name('mailchimp.remove.connection');

    Route::get('/get-aff-icons', [IconController::class, 'getAffIcons']);
    Route::get('/get-standard-icons', [IconController::class, 'getStandardIcons']);
    Route::get('/get-custom-icons', [IconController::class, 'getCustomIcons']);

    Route::group(['prefix' => 'dashboard'], function() {
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
        Route::post('/page/update-bio/{page}', [PageController::class, 'updateBio'])->name('page.bio.update');
        Route::post('/page/update-profile-layout/{page}', [PageController::class, 'updateProfileLayout'])->name('profile.layout.update');

        Route::get('/page/get-links/{page}', [LinkController::class, 'getPageLinks'])->name('page.get.links');

        Route::get('/pages/folder/links/{folder}', [FolderController::class, 'getFolderLinks'])->name('get.folder.links');
        Route::post('/folder/status/{folder}', [FolderController::class, 'updateFolderStatus']);
        Route::post('/folder/delete/{folder}', [FolderController::class, 'destroy']);
        Route::post('/folder/update-name/{folder}', [FolderController::class, 'updateName']);
    });

    Route::group(['prefix' => 'course-manager'], function() {
        Route::get('/add-landing-page', [LandingPageController::class, 'store'])->name('add.landing.page');
        Route::get('/add-course', [CourseController::class, 'store'])->name('add.course');

        Route::group(['prefix' => 'landing-page'], function() {
            Route::post('/save-image/{landing_page}', [LandingPageController::class, 'saveImage'])->name('lp.save.image');
            Route::post('/save-data/{landing_page}', [LandingPageController::class, 'saveLandingPageData'])->name('lp.save.data');
            Route::post('/add-section/{landing_page}', [LandingPageController::class, 'addSection'])->name('lp.add.section');
            Route::post('/delete-section/{landing_page_section}', [LandingPageController::class, 'deleteSection'])->name('delete.section');
            Route::post('/update-section-data/{landing_page_section}', [LandingPageController::class, 'updateSectionData'])->name('update.section.data');
            Route::post('/update-section-image/{landing_page_section}', [LandingPageController::class, 'updateSectionImage'])->name('update.section.image');
            Route::post('/publish/{landing_page}', [LandingPageController::class, 'publishLandingPage'])->name('publish.landing_page');
        });

        Route::group(['prefix' => 'course'], function() {
            Route::post('/save-data/{course}', [CourseController::class, 'saveCourseData'])->name('course.save.data');
            Route::post('/add-section/{course}', [CourseController::class, 'addSection'])->name('course.add.section');
            Route::post('/update-section-image/{course}', [CourseController::class, 'addSection'])->name('update.course.section.image');
            Route::post('/delete-section/{course_section}', [CourseController::class, 'deleteSection'])->name('delete.course.section');
            Route::post('/update-section-data/{course_section}', [CourseController::class, 'updateSectionData'])->name('update.course.section.data');
        });

        Route::group(['prefix' => 'offer'], function() {
            Route::post('/update-icon/{offer}', [OfferController::class, 'updateOfferIcon'])->name('update.offer.icon');
            Route::post('/update-data/{offer}', [OfferController::class, 'updateOfferData'])->name('update.offer.data');
            Route::post('/publish/{offer}', [OfferController::class, 'publishOffer'])->name('publish.offer');
        });
    });

    Route::get('/courses', [CourseController::class, 'showCoursesLpUser'])->name('all.courses.lpuser');

    Route::post('logout', [UserController::class, 'logout'])->name('logout');
});

Route::group(['middleware' => ['auth', 'EnsureLinkIsCreated', 'lp.user']], function() {

    Route::group(['prefix' => 'dashboard'], function() {
        Route::get('/pages/{page}', [PageController::class, 'edit'])->name('pages.edit');
        Route::get('/pages', [PageController::class, 'redirect']);
        Route::get('/', [PageController::class, 'redirect'])->name('dashboard');
    });

    Route::get('/course-manager', [CourseController::class, 'showCourseManager'])->name('course.manager');
    Route::get('/course-manager/landing-page/{landing_page}', [LandingPageController::class, 'edit'])->name('edit.landing.page');
    Route::get('/course-manager/course/{course}', [CourseController::class, 'edit'])->name('edit.course');
    Route::get('/plans', [SubscriptionController::class, 'plans'])->name('plans.get');
    Route::get('/subscribe', [SubscriptionController::class, 'purchase'])->name('subscribe.get');

    Route::post('/stats/link/range', [StatsController::class, 'getLinkStatsRange']);
    Route::post('/stats/page/range', [StatsController::class, 'getPageStatsRange']);
    Route::post('/stats/folder/range', [StatsController::class, 'getFolderStatsRange']);
    Route::get('/stats/get/page', [StatsController::class, 'getPageStats']);
    Route::get('/stats/get/link', [StatsController::class, 'getLinkStats']);
    Route::get('/stats/get/deleted', [StatsController::class, 'getDeletedStats']);
    Route::get('/stats/get/folder', [StatsController::class, 'getFolderStats']);
    Route::get('/stats', [StatsController::class, 'show'])->name('stats');

});

Route::group(['middleware' => ['course.user']], function() {
    Route::get('/{user:username}/password/reset/', [CoursePasswordController::class, 'showPasswordUpdate'])->name('show.password.update');
    Route::get('/{user:username}/course/login', [LoginController::class, 'courseLogin'])->name('course.login');
    Route::get('/{user:username}/course/reset-password', [CoursePasswordController::class, 'showResetPassword'])->name('show.reset.password');
    Route::get('/{user:username}/courses', [CourseController::class, 'showAllCourses'])->name('all.courses');
    Route::get('/{user:username}/course/{course:slug}', [CourseController::class, 'show'])->name('live.course.page');
    Route::get('/{user:username}/course/{course:slug}/checkout', [PurchaseController::class, 'show'])->name('course.checkout');
    Route::get('/{user:username}/{landing_page:slug}', [LandingPageController::class, 'show'])->name('live.landing.page');
});

Route::post('/send-reset-course-password', [CoursePasswordController::class, 'sendResetCoursePassword'])->name('send.reset.course.password');
Route::post('/reset-course-password', [CoursePasswordController::class, 'resetCoursePassword'])->name('reset.course.password');
Route::post('/course-register', [CourseRegisterController::class, 'customRegistration'])->name('course.register');
Route::post('/checkout/purchase', [PurchaseController::class, 'store'])->name('course.purchase');

Route::post('/mailchimp/subscribe', [MailchimpController::class, 'subscribeToList'])->name('mailchimp.subscribe');

Route::get('/contact', [ContactMailController::class, 'index'])->name('contact');
Route::post('/contact/send', [ContactMailController::class, 'contactSendMail'])->name('contact.send');

Route::post('/braintree/webhooks/charged-successfully', [WebhookController::class, 'chargedSuccessfully']);
Route::post('/braintree/webhooks/sub-went-active', [WebhookController::class, 'subWentActive']);

Route::get('/get-icons', [IconController::class, 'getIcons']);

Route::view('/','home')->name('guest-home');
Route::view('/terms-and-conditions', 'utility.terms')->name('terms');
Route::view('/privacy-policy', 'utility.privacy')->name('privacy');
Route::view('/how-it-works', 'utility.how-it-works')->name('how-it-works');
Route::view('/plan-options', 'subscription.public-plans')->name('public.plans');

Route::post('/check-page-auth/{page}', [PageController::class, 'pageAuth'])->name('check.page.auth');
Route::get('/email-subscription/{user}', [UserController::class, 'emailSubscription'])->name('email.subscription');
Route::post('/link-click/{link}', [TrackingController::class, 'storeLinkVisit']);
Route::post('/folder-click/{folder}', [TrackingController::class, 'storeFolderClick']);
Route::get('/setup', [UtilityController::class, 'showSetupPage'])->name('setup.page');
Route::get('/{page}', [PageController::class, 'show'])->name('show.live.page');

