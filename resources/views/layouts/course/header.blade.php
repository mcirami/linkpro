<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('/js/app.js') }}" defer></script>
    @if(Route::is('course.checkout'))
        <script src="https://js.braintreegateway.com/web/3.82.0/js/client.min.js"></script>
        <script src="https://js.braintreegateway.com/web/dropin/1.32.0/js/dropin.min.js"></script>
    @endif
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

</head>
<body>
@auth
    @if(Auth::user()->role_id == 3)
        @include('layouts.courseMenu')
    @else
        @include('layouts.menu')
    @endif
@endauth
<div id="app" class="my_row member course_page">
    <header class="my_row nav_row" style="background: {{ $landingPageData["header_bg_color"] ?: "rgba(0,0,0,1)"}}">
        <nav>
            <div class="container">
                <a class="logo" href="{{ Request::url() }}">
                    <h1><img src="{{ $landingPageData["logo"] }}" alt="{{ $landingPageData["title"] ?? ''}}"></h1>
                </a>
            </div>
        </nav>
    </header>

    <main>
        @yield('content')
    </main>

    <div class="my_row user_page_footer">
        <div class="image_wrap">
            <a href="{{ Route('register') }}" target="_blank">
                <p>Powered By</p>
                <img src="{{ asset('/images/logo.png') }}" alt="">
            </a>
        </div>
    </div>

</div>
</body>
</html>
