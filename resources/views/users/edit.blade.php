@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="my_row form_page">
            <div class="card">
                <h2 class="page_title">Update Account Settings</h2>
                <div class="card-body">
                    <div class="my_row three_columns">
                        <div class="column">
                            <h2 class="text-uppercase">Account Info</h2>
                            <form method="POST" action="/update-account/{{ $user->id }}">
                                @csrf
                                    <div class="form_inputs">
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

                                            <div class="col-12">
                                                <input placeholder="E-mail Address" id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ $user->email }}" required autocomplete="email">

                                                @if ($errors->has('email'))
                                                    <span class="invalid-feedback" role="alert">
                                                <strong>{{ $errors->first('email')  }}</strong>
                                            </span>
                                                @endif
                                            </div>
                                        </div>
                                        <div class="form-group row">

                                            <div class="col-12">
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
                                            <div class="col-12">
                                                <input placeholder="Confirm Password" id="password-confirm" type="password" class="form-control" name="password_confirmation" autocomplete="new-password">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row form_buttons">
                                        <div class="col-12">
                                            <button type="submit" class="button blue text-uppercase">
                                                {{ __('Update My Info') }}
                                            </button>
                                        </div>
                                    </div>
                            </form>
                        </div>
                        <div class="column">
                            <h2 class="text-uppercase">Plan Type</h2>
                            <h4>Your Current Plan is</h4>
                            @if($subscription && $subscription->stripe_status == "active")
                                <div class="plan_name">
                                    <p>{{ $subscription->name }}</p>
                                    <img src="{{ asset('../images/plan-type-bg.png') }}" alt="">
                                </div>
                                @if($subscription->ends_at)
                                    <div class="canceled_text">
                                        <p>Your subscrition has been cancelled. It will end on: <span>{{$subscription->ends_at->format('F j, Y')}}</span></p>
                                    </div>
                                    <button class="open_popup button green" data-plan="{{ $subscription->name }}" data-type="resume">Resume Subscription</button>
                                @else
                                    <a href="#" class="open_popup" data-plan="{{ $subscription->name }}" data-type="cancel">Cancel Subscription</a>
                                @endif
                            @else
                                <div class="plan_name">
                                    <p>Free</p>
                                    <img src="{{ asset('../images/plan-type-bg.png') }}" alt="">
                                </div>
                            @endif
                            @if($subscription && $subscription->stripe_status == "active")
                                @if($subscription->name == "pro" && !$subscription->ends_at)
                                    <button class="open_popup button blue" data-type="upgrade" data-level="corporate" data-plan="price_1JS1qkGIBktjIJUPVSjN20LH">
                                        Upgrade My Plan
                                    </button>

                                   {{-- <form class="plan" method="post" action="{{ url('/change-plan') }}">
                                        @csrf
                                        <input type="hidden" name="level" value="corporate">
                                        <input type="hidden" name="plan" data-level="corporate" id="corporate" value="price_1JS1qkGIBktjIJUPVSjN20LH">

                                    </form>--}}
                                @elseif($subscription->name == "corporate")
                                    <button class='button blue open_popup' data-type="downgrade" data-level="pro" data-plan="price_1JS1p5GIBktjIJUPjG5ksGFb">
                                        Downgrade My Plan
                                    </button>
                                    {{--<form class="plan" method="post" action="{{ url('/change-plan') }}">
                                        @csrf
                                        <input type="hidden" name="level" value="pro">
                                        <input type="hidden" name="plan" data-level="pro" id="pro" value="price_1JS1p5GIBktjIJUPjG5ksGFb">

                                    </form>--}}
                                @endif
                            @endif
                        </div>
                        @if ($subscription)
                            <div class="column">
                                <h2 class="text-uppercase">Billing Info</h2>
                                <form method="POST" action="">
                                    @csrf
                                    @if ($payment_method->type == "card")
                                        <div class="form-group row form_inputs">
                                            <div class="col-12 p-0">
                                                <h4>Your current payment type is</h4>
                                                <input type="text" value="" placeholder="xxxx xxxx xxxx {{$payment_method->card["last4"]}}">
                                                @error('password')
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ $errors->first('password')  }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>
                                        <div class="form-group row form_buttons">
                                            <div class="col-12">
                                                <button type="submit" class="button blue text-uppercase">
                                                    {{ __('Change Payment Method') }}
                                                </button>
                                            </div>
                                        </div>
                                    @endif
                                </form>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    @if (session()->has('success'))
        <div class="display_message alert" id="laravel_flash">
            <div class="icon_wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
            </div>
            <p>{{ session()->get('success')}}</p>
            <span class="close"><strong>CLOSE</strong></span>
        </div>
    @endif

    @include('layouts.popup')

@endsection
