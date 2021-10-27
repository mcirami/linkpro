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
    <script src="https://js.braintreegateway.com/web/dropin/1.31.2/js/dropin.min.js"></script>
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

</head>
<body>
    <div id="app">
        <nav class="my_row nav_row">
            <div class="container">
                <div class="content_wrap">
                    <a class="logo" href="{{ url('/dashboard') }}">
                        <h1><img src="{{ asset('images/logo.png') }}" alt="Link Pro"></h1>
                    </a>
                    <div class="right_column">
                        @php $userSub = Auth::user()->subscriptions()->first(); @endphp

                        @if( empty($userSub) || ($userSub->name != "premier" && !$userSub->ends_at) || ($userSub->ends_at && $userSub->ends_at < \Carbon\Carbon::now()) )
                            <div class="upgrade_link">
                                <a class="button blue" href="{{route('plans.get')}}">Upgrade</a>
                            </div>
                        @endif
                        <div class="toggler" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                            {{--<span class="navbar-toggler-icon"></span>--}}
                            <a class="mobile_menu_icon" href="#">
                                <span></span>
                                <span></span>
                                <span></span>
                            </a>
                        </div>

                        <div class="nav_links_wrap" id="navbarSupportedContent">

                            <!-- Right Side Of Navbar -->
                            <ul class="navbar-nav ml-auto">
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
                                    @php $page = Auth::user()->pages()->where('user_id', Auth::user()->id)->where('default', true)->get(); $image = $page[0]->profile_img;  @endphp
                                   {{-- <li class="nav-item dropdown">
                                        <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src="{{ $image ? : asset('images/profile-placeholder-img.png') }}" alt="User Profile"> {{ Auth::user()->username }}
                                        </a>

                                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <a class="dropdown-item" href="{{ url('/dashboard/pages/' . $page[0]->id) }}">Dashboard</a>
                                            <a class="dropdown-item" href="{{ route('user.edit') }}">Settings</a>
                                            <a class="dropdown-item" href="{{ route('logout') }}"
                                               onclick="event.preventDefault();
                                                             document.getElementById('logout-form').submit();">
                                                {{ __('Logout') }}
                                            </a>

                                            <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                                @csrf
                                            </form>
                                        </div>
                                    </li>--}}
                                    <li class="mobile">
                                        <a class="nav-link" href="{{ route('user.edit') }}">
                                            <img src="{{ $image ? : asset('images/profile-placeholder-img.png') }}" alt="User Profile"> {{ Auth::user()->username }}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="{{ url('/dashboard/pages/' . $page[0]->id) }}" class=@php if(Route::is('pages.edit')) { echo "current"; } @endphp>Dashboard</a>
                                    </li>
                                    <li>
                                        <a href="{{ route('user.edit') }}" class=@php if(Route::is('user.edit')) { echo "current"; } @endphp>Settings</a>
                                    </li>
                                    {{--<li>
                                        <a href="{{ route('logout') }}"
                                           onclick="event.preventDefault();
                                                             document.getElementById('logout-form').submit();">
                                            {{ __('Logout') }}
                                        </a>

                                        <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                            @csrf
                                        </form>
                                    </li>--}}
                                    <li class="nav-item dropdown">
                                        <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src="{{ $image ? : asset('images/profile-placeholder-img.png') }}" alt="User Profile"> {{ Auth::user()->username }}
                                        </a>

                                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <a class="dropdown-item" href="{{ route('logout') }}"
                                               onclick="event.preventDefault();
                                                             document.getElementById('logout-form').submit();">
                                                {{ __('Logout') }}
                                                <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                                    @csrf
                                                </form>
                                            </a>
                                        </div>
                                    </li>
                                    <li class="mobile">
                                        <a href="{{ route('logout') }}"
                                           onclick="event.preventDefault();
                                                             document.getElementById('logout-form-mobile').submit();">
                                            {{ __('Logout') }}
                                            <form id="logout-form-mobile" action="{{ route('logout') }}" method="POST" class="d-none">
                                                @csrf
                                            </form>
                                        </a>
                                    </li>
                                @endguest
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <main>
            @yield('content')
        </main>

        @include('footer')

    </div>
</body>
</html>
