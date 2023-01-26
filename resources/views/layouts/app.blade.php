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
    <script src="https://js.braintreegateway.com/web/3.82.0/js/client.min.js"></script>
    <script src="https://js.braintreegateway.com/web/dropin/1.32.0/js/dropin.min.js"></script>
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

</head>
<body id="body">
@include('layouts.menu')
    <div id="app" class="my_row">
        <header class="my_row nav_row">
            <nav>
                <div class="container">
                    <div class="content_wrap">
                        <div class="left_column">
                            <a class="logo" href="{{ url('/dashboard') }}">
                                <h1><img src="{{ asset('images/logo.png') }}" alt="Link Pro"></h1>
                            </a>
                        </div>
                        <div class="right_column">
                            @php $userSub = Auth::user()->subscriptions()->first(); @endphp

                            <div class="nav_links_wrap" >

                                <!-- Right Side Of Navbar -->
                                <ul class="ml-auto">
                                    <!-- Authentication Links -->
                                    @guest
                                        @if (Route::has('login'))
                                            <li class="nav-item">
                                                <a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a>
                                            </li>
                                        @endif

                                        @if (Route::has('register'))
                                            <li class="nav-item">
                                                <a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a>
                                            </li>
                                        @endif
                                    @else
                                        @if( empty($userSub) || ($userSub->name != "premier" && !$userSub->ends_at) || ($userSub->ends_at && $userSub->ends_at < \Carbon\Carbon::now()) )
                                            <li class="upgrade_link">
                                                <a class="button blue" href="{{route('plans.get')}}">Upgrade</a>
                                            </li>
                                        @endif
                                        <li class="nav-item">
                                            @php $page = Auth::user()->pages()->where('user_id', Auth::user()->id)->where('default', true)->get(); $image = $page[0]->profile_img;  @endphp
                                            <a class="nav-link" href="{{ route('user.edit') }}" role="button" >
                                                <img id="user_image" src="{{ $image ? : asset('images/profile-placeholder-img.png') }}" alt="User Profile"><span id="username">{{ Auth::user()->username }}</span>
                                            </a>
                                        </li>
                                    @endguest
                                </ul>
                            </div>
                        </div>
                    </div>
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
