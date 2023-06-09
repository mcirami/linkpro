<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ $course->title ?? config('app.name', 'Laravel') }}</title>

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
    @include('layouts.menu')
@endauth
<div id="app" class="my_row @auth member @endauth course_page">
    <header class="my_row nav_row" style="background: {{ $course->header_color }}">
        <nav>
            <div class="container">
                <a class="logo" href="{{ Request::url() }}">
                    <h1><img src="{{ $course->logo }}" alt="{{ $course->title ?? ''}}"></h1>
                </a>
            </div>
        </nav>
    </header>

    <main>
        @yield('content')
    </main>

    @include('layouts.course.footer')

</div>
</body>
</html>
