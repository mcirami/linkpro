@extends('layouts.app')

@section('content')

    <div class="my_row form_page checkout">
        <div class="container">
            <div class="card">
                <div>
                    <h3>Upgrade Now to Get All The Benefits!</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 col-md-6 plan_details order-md-0 order-1 ">
                            <div class="row">
                                <div class="col-12 col-lg-6">
                                    <h2>Pro</h2>
                                    <ul>
                                        <li><p><img src="{{ asset('images/check-circle-violet.png') }}" alt="">1 Unique Link</p></li>
                                        <li><p><img src="{{ asset('images/check-circle-violet.png') }}" alt="">Up to 9 icons</p></li>
                                        <li><p><img src="{{ asset('images/check-circle-violet.png') }}" alt="">Choose Default Icons</p></li>
                                        <li><p><img src="{{ asset('images/check-circle-violet.png') }}" alt="">Custom Icon Links</p></li>
                                        <li><p><img src="{{ asset('images/check-circle-violet.png') }}" alt="">Custom Icons</p></li>
                                        <li><p><img src="{{ asset('images/check-circle-violet.png') }}" alt="">Unlimited Icons</p></li>
                                    </ul>
                                </div>
                                <div class="col-12 col-lg-6">
                                    <h2>Corporate</h2>
                                    <h4>All The Benefits of the Pro Plan Plus:</h4>
                                    <ul>
                                        <li><p><img src="{{ asset('images/check-circle-blue.png') }}" alt="">Up to 5 Unique Links</p></li>
                                        <li><p><img src="{{ asset('images/check-circle-blue.png') }}" alt="">Password Protected Links</p></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 credit_card_form order-md-1 order-0">
                            <div class="form-group row">
                                {{--<div class="col-12 radio_buttons">
                                    <div>
                                        <input type="radio" name="plan" data-level="pro" id="pro" data-price="499" value="price_1JS1p5GIBktjIJUPjG5ksGFb" {{$plan == "pro" || $plan == null ? "checked" : ""}}>
                                        <label for="pro">Pro - $4.99/month</label>
                                    </div>
                                    <div>
                                        <input type="radio" name="plan" data-level="corporate" data-price="1999" id="corporate" value="price_1JS1qkGIBktjIJUPVSjN20LH" {{$plan == "corp" ? "checked" : ""}}>
                                        <label for="corporate">Corporate - $19.99/month</label>
                                    </div>
                                </div>--}}
                            </div>
                            <form id="payment-button-form" action="{{ route('subscribe.post') }}" method="post" data-secret="{{ $paymentIntent->client_secret }}">
                                @csrf
                                <input type="hidden" id="amount" name="amount" value="{{ $paymentIntent->amount }}">
                                <input type="hidden" name="plan" value="{{ $plan == "pro" ? 'price_1JS1p5GIBktjIJUPjG5ksGFb' : 'price_1JS1qkGIBktjIJUPVSjN20LH' }}">
                                <input type="hidden" name="level" value="{{ $plan }}">
                                <div id="payment-request-button">
                                    <!-- A Stripe Element will be inserted here. -->
                                </div>
                            </form>

                            <form id="payment-form" action="{{ route('subscribe.post') }}" method="post" data-secret="{{ $intent->client_secret }}">
                                @csrf
                                <input type="hidden" name="plan" value="{{ $plan == "pro" ? 'price_1JS1p5GIBktjIJUPjG5ksGFb' : 'price_1JS1qkGIBktjIJUPVSjN20LH' }}">
                                <input type="hidden" name="level" value="{{ $plan }}">
                                <div class="form-group row">
                                    <div class="col-12">
                                        <input type="text" id="cardholder-name" name="cardholderName" placeholder="Cardholder Name" required>
                                    </div>
                                </div>
                                <div id="card-element">
                                    <!-- Elements will create input elements here -->
                                </div>
                                <!-- We'll put the error messages in this element -->
                                <div id="card-errors" role="alert"></div>

                                <button class="button blue">
                                    <span class="spinner hidden" id="spinner"></span>
                                    Pay With Credit Card
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
@endsection
