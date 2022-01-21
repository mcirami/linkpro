const mix = require('laravel-mix');
require('core-js');
require('laravel-mix-polyfill');
const path = require('path');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

module.exports = {
    resolve: {
        alias: {
            myApp: path.resolve(__dirname, 'resources/js')
        }
    }
}

mix.js('resources/js/app.js', 'public/js')
    .react()
    .sass('resources/sass/app.scss', 'public/css')
    .polyfill({
        enabled: true,
        useBuiltIns: 'entry',
        targets: false,
        entryPoints: "stable",
        corejs: 3,
    });

mix.sass('resources/sass/admin.scss', 'public/css/admin' );
