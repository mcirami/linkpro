@extends('layouts.guest.header')

@section('content')
<div class="container">
    <div class="my_row form_page">
        <div class="card">
            <h3>{{ __('Sign in to your linkpro account') }}</h3>

            <div class="card-body">
                <form method="POST" action="{{ route('login') }}">
                    @csrf

                    <div class="form-group row">

                        <div class="col-md-8 mx-auto">
                            <input placeholder="Username or Email" id="username" type="text" class="form-control @error('username') is-invalid @enderror" name="identity" value="{{ old('username') }}" required autofocus>

                            @error('identity')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">

                        <div class="col-md-8 mx-auto">
                            <input placeholder="Password" id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                            @error('password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <div class="col-md-8 offset-md-2">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                                <label class="form-check-label" for="remember">
                                    {{ __('Remember Me') }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group row mb-0">
                        <div class="col-md-8 offset-md-2">
                            <button type="submit" class="btn btn-primary text-uppercase">
                                {{ __('Sign In') }}
                            </button>
                        </div>
                    </div>

                    @if (Route::has('password.request'))
                        <div class="form-group mb-0">
                            <div class="col-12 text-center">
                                <a class="btn btn-link" href="{{ route('password.request') }}">
                                    {{ __('Forgot Your Password?') }}
                                </a>
                            </div>
                        </div>
                    @endif

                    <div class="form-group row mb-0">
                        <div class="col-12 text-center">
                           <p>Don't have an account? <a href="/register">Create one</a></p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

</div>
@endsection
