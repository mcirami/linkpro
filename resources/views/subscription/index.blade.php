@extends('layouts.app')

@section('content')

    <div class="my_row form_page plans checkout">
        <div class="container">
            <div class="card">
                <h2 class="page_title mb-0">Upgrade to <span class="text-capitalize">{{$plan}}</span> For Only </h2>
                <div class="pricing m-0">
                    <h3><sup>$</sup>{{ $plan == "pro" ? '4.99' : '19.99'}}<span>/ mo</span></h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 col-md-6 plan_details order-md-0 order-1 ">
                            <div class="row">
                                <div class="col-12 my_row three_columns">
                                    <div class="column {{$plan}}">
                                        <h2 class="text-uppercase"><span>{{$plan}} Plan</span> Includes</h2>
                                        <ul>
                                            @if($plan == "pro")
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                        <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                                    </svg>
                                                    <p>1 Unique Link</p>
                                                </li>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                        <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                                    </svg>
                                                    <p>Unlimited Icons</p>
                                                </li>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                        <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                                    </svg>
                                                    <p>Custom Icons</p>
                                                </li>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                        <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                                    </svg>
                                                    <p>Add Social Links</p>
                                                </li>
                                            @else
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                        <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                                    </svg>
                                                    <p>Up to 5 Unique Links</p>
                                                </li>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                        <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                                    </svg>
                                                    <p>Unlimited Icons</p>
                                                </li>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                        <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                                    </svg>
                                                    <p>Custom Icons</p>
                                                </li>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                        <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                                    </svg>
                                                    <p>Password Protected Links</p>
                                                </li>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                        <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                                    </svg>
                                                    <p>Add Social Links</p>
                                                </li>
                                            @endif
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 credit_card_form order-md-1 order-0">
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
                                    <div class="spinner hidden" id="spinner"></div>
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
