<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>
     @if(Route::current()->getName() == 'course.checkout')
        <script src="https://js.braintreegateway.com/web/3.82.0/js/client.min.js"></script>
        <script src="https://js.braintreegateway.com/web/dropin/1.32.0/js/dropin.min.js"></script>
    @endif
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body class="guest">
<div id="app">
    <header class="guest_header">
        <div class="column left">
            <h1><a href="/"><img src="{{ asset('images/logo.png') }}" alt="Link Pro"></a></h1>
        </div>
        <div class="column right">
            <a href="/login">Log In</a>
            <a href="{{route('contact')}}">Contact Us</a>
            <a class="button transparent" href="/register">Sign Up</a>
        </div>
    </header>

    <main class="@if(Route::is('guest-home')) guest_home @endif">
        @yield('content')
    </main>

    @include ('layouts.guest.footer')
</div>
</body>
</html>
