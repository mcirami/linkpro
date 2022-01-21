/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');


require('./custom');

window.Vapor = require('laravel-vapor');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
if (document.getElementById('root')) {
    require('./Pages/Dashboard/components/Index');
}
if (document.getElementById('create_page')) {
    require('./Pages/Register/Index');
}
if (document.getElementById('stats')) {
    require('./Pages/Stats/Index');
}

if (document.getElementById('setup')) {
    require('./Pages/Setup/Index');
}

if (document.getElementById('admin_filters')) {
    require('./Pages/Admin/Index');
}

/*if (document.getElementById('profile_img')) {
    require('./components/ProfileImage/Index');
}*/
//require('./components/Preview');


