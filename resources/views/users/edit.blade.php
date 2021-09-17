@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="my_row form_page edit_profile">
            <div class="card">
                <h3>Update Account Information</h3>
                <div class="card-body">
                    <form method="POST" action="/update-account/{{ $user->id }}">
                        @csrf
                        <div class="row">
                            <div class="col-12 col-md-4 page_settings">
                                <div id="avatar"></div>
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
                <h3>Your Plan Information</h3>
                <div class="card-body">
                    <h4>Plan Level: </h4>
                    @if($subscription && $subscription->stripe_status == "active")
                        <p>{{ $subscription->name }}</p>
                        @if($subscription->ends_at)
                            <p>Your subscrition has been cancelled. It will end on:</p>
                            <p>{{$subscription->ends_at->format('F j, Y')}}</p>
                            <a href="#" class="open_popup" data-plan="{{ $subscription->name }}" data-type="resume">Resume Subscription</a>
                        @else
                            <a href="#" class="open_popup" data-plan="{{ $subscription->name }}" data-type="cancel">Cancel Subscription</a>
                        @endif
                    @else
                        <p>Free</p>
                    @endif
                    @if($subscription && $subscription->stripe_status == "active")
                        @if($subscription->name == "pro")
                            <form method="post" action="{{ url('/change-plan') }}">
                                @csrf
                                <input type="hidden" name="level" value="corporate">
                                <input type="hidden" name="plan" data-level="corporate" id="corporate" value="price_1JS1qkGIBktjIJUPVSjN20LH">
                                <button class='button pink_gradient' type="submit">
                                    Upgrade
                                </button>
                            </form>
                        @else
                            <form method="post" action="{{ url('/change-plan') }}">
                                @csrf
                                <input type="hidden" name="level" value="pro">
                                <input type="hidden" name="plan" data-level="pro" id="pro" value="price_1JS1p5GIBktjIJUPjG5ksGFb">
                                <button class='button pink_gradient' type="submit">
                                    Downgrade
                                </button>
                            </form>
                        @endif
                    @endif

                    {{--@if(($subscription && $subscription->name == "pro" && $subscription->stripe_status == "active") || !$subscription)
                        <h3>Upgrade your plan to get all the benefits</h3>
                        <div class="text-center m-5">
                            <a class="button blue" href="{{route('plans.get')}}">Upgrade Now</a>
                        </div>
                    @endif--}}
                </div>
            </div>
        </div>
        @if ($subscription)
            <div class="my_row form_page edit_profile mt-5">
                <div class="card">
                    <h3>Update Billing Information</h3>
                    <div class="card-body">
                        <form method="POST" action="">
                            @csrf

                            @if ($payment_method->type == "card")
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
        @endif
    </div>

    @if (session()->has('success'))
        <div class="display_message alert" id="laravel_flash">
            <div class="icon_wrap">

            </div>
            <p>{{ session()->get('success')}}</p>
            <span class="close"><strong>CLOSE</strong></span>
        </div>
    @endif

    @include('layouts.popup')

@endsection
