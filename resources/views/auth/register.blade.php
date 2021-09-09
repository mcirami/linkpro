@extends('layouts.guest.header')

@section('content')
<div class="container">
    <div class="my_row form_page">
        <div class="card">
            <div>
                <h3>Take control of your social sharing!</h3>
                <h4 class="text-center">Grab a free account or get advanced features!</h4>
            </div>

            <div class="card-body">
                <form method="POST" action="{{ route('register') }}">
                    @csrf

                    <div class="form-group row">
                        {{--<label for="username" class="col-md-4 col-form-label text-md-right">{{ __('Username') }}</label>--}}

                        <div class="col-sm-10 mx-auto d-flex justify-content-center align-items-center link_name">
                            <label>Link.pro/</label>
                            <input placeholder="Link" id="username" type="text" class="form-control @error('username') is-invalid @enderror" name="username" value="{{ old('username') }}" required autocomplete="username" autofocus>

                            @error('username')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        {{--<label for="email" class="col-md-4 col-form-label text-md-right">{{ __('E-Mail Address') }}</label>--}}

                        <div class="col-sm-10 mx-auto">
                            <input placeholder="E-mail Address" id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

                            @error('email')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        {{--<label for="password" class="col-md-4 col-form-label text-md-right">{{ __('Password') }}</label>--}}

                        <div class="col-sm-10 mx-auto">
                            <input placeholder="Password" id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                            @error('password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        {{--<label for="password-confirm" class="col-md-4 col-form-label text-md-right">{{ __('Confirm Password') }}</label>
--}}
                        <div class="col-sm-10 mx-auto">
                            <input placeholder="Confirm Password" id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-sm-10 mx-auto">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }} required>

                                <label class="form-check-label" for="remember">
                                    By creating an account you are agreesing to our <a href="#">Terms and Conditions</a> and
                                        <a href="#">Privacy Policy</a>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row mb-3">
                        <div class="col-sm-10 mx-auto">
                            <button type="submit" class="btn btn-primary text-uppercase">
                                {{ __('Let\'s Do This') }}
                            </button>
                        </div>
                    </div>
                    <div class="form-group row mb-0 bottom_row">
                        <div class="col-12 text-center">
                            <p><a href="{{ route('login') }}">Already on LinkPro? Login Now</a></p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

</div>
@endsection
