@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="my_row form_page edit_profile">
            <div class="card">
                <div>
                    <h3>Update Account Information</h3>
                </div>

                <div class="card-body">
                    <form method="POST" action="/update-account/{{$user->id}}">
                        @csrf
                        <div class="row">
                            <div class="col-12 col-md-4 page_settings">
                                <div id="avatar"></div>
                                {{--<div class="image_wrap">
                                    <img src="{{ $user->profile_image ? : asset('images/profile-placeholder-img.png') }}" alt="User Profile">
                                </div>--}}
                            </div>
                            <div class="col-12 col-md-8">
                                <div class="form-group row">
                                    <div class="col-12 mx-auto">
                                        <input placeholder="Username" id="username" type="text" class="form-control @error('username') is-invalid @enderror" name="username" value="{{ $user->username }}" required autocomplete="username" autofocus>

                                        @if ($errors->has('username'))
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ $errors->first('username')  }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>
                                <div class="form-group row">

                                    <div class="col-12 mx-auto">
                                        <input placeholder="E-mail Address" id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ $user->email }}" required autocomplete="email">

                                        @if ($errors->has('email'))
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ $errors->first('email')  }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>
                                <div class="form-group row">

                                    <div class="col-12 mx-auto">
                                        <input placeholder="Password" id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" autocomplete="new-password">
                                        <small>(Enter password only if you want to change it)</small>
                                        @error('password')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $errors->first('password')  }}</strong>
                                        </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="col-12 mx-auto">
                                        <input placeholder="Confirm Password" id="password-confirm" type="password" class="form-control" name="password_confirmation" autocomplete="new-password">
                                    </div>
                                </div>
                                <div class="form-group row mb-3">
                                    <div class="col-12 mx-auto">
                                        <button type="submit" class="btn btn-primary text-uppercase">
                                            {{ __('Update') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="my_row form_page edit_profile mt-5">
            <div class="card">
                <div>
                    <h3>Update Billing Information</h3>
                </div>

                <div class="card-body">
                    <form method="POST" action="">
                        @csrf

                        @if ($payment_method && $payment_method->type == "card")
                            <div class="form-group row">
                                <div class="col-12 mx-auto">
                                    <p>{{$payment_method->card["brand"]}}</p>
                                    <input type="text" value="" placeholder="xxxx xxxx xxxx {{$payment_method->card["last4"]}}">
                                    @error('password')
                                    <span class="invalid-feedback" role="alert">
                                            <strong>{{ $errors->first('password')  }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                            <div class="form-group row mb-3">
                                <div class="col-12 mx-auto">
                                    <button type="submit" class="btn btn-primary text-uppercase">
                                        {{ __('Update') }}
                                    </button>
                                </div>
                            </div>
                        @endif
                    </form>
                </div>
            </div>
        </div>
    </div>
    @if (session()->has('success'))
        <div class="display_message alert" id="laravel_flash">
            <div class="icon_wrap">

            </div>
            <p>{{ session()->get('success')}}</p>
            <span class="close"><strong>CLOSE</strong></span>
        </div>
    @endif
@endsection
