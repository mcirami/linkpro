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
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

</head>
<body>
@include('layouts.menu')
<div id="app" class="my_row member course_page">
    <header class="my_row nav_row" style="background: {{$course["header_bg_color"] ?: "rgba(0,0,0,1)"}}">
        <nav>
            <div class="container">
                <a class="logo" href="{{ url('/dashboard') }}">
                    <h1><img src="{{$logo}}" alt="{{$course["title"]}}"></h1>
                </a>
            </div>
        </nav>
    </header>
    <main>
        @yield('content')
    </main>

    @include('footer')

</div>
</body>
</html>
