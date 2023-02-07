@extends('layouts.course.header')

@section('content')

    <div class="container">
        <div class="my_row form_page checkout course_purchase mt-5">
            <h2 class="page_title text-center">Checkout Now</h2>
            @if (count($errors) > 0)
                <div class="alert alert-danger">
                    <ul>
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            <div class="card guest">
                <div class="card-body">
                    @guest
                        <form class="my_row" method="post" id="course_register" action="{{ route('course.register') }}">
                            <div class="text_wrap text-center">
                                <h3>First Step: Register For An Account</h3>
                            </div>
                            <section>
                                <div class="form-group row">

                                    <div class="col-12">
                                        <input placeholder="Username" id="username" type="text" class="form-control @error('username') is-invalid @enderror" name="username" value="{{ old('username') }}" required autocomplete="username">

                                        @error('username')
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ $errors->first('username') }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">

                                    <div class="col-12">
                                        <input placeholder="E-mail Address" id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

                                        @error('email')
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ $errors->first('email') }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-12">
                                        <input placeholder="Password" id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                                        @error('password')
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ $errors->first('password') }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-12">
                                        <input placeholder="Confirm Password" id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
                                    </div>
                                </div>
                            </section>
                            <div class="button_wrap">
                                <button class="button blue" type="submit">Next</button>
                            </div>
                        </form>
                    @endguest

                    <form method="post" class="my_row @guest offscreen @endguest" id="payment-form" action="{{ route('course.purchase') }}">
                        <div class="text_wrap text-center">
                            <h3>You are purchasing {{$courseTitle}} course for ${{$offer->price}}</h3>
                        </div>
                        @csrf
                        <input id="nonce" name="payment_method_nonce" type="hidden" />
                        <input type="hidden" name="offer" value="{{$offer->id}}">
                        <input id="form_discount_code" type="hidden" name="discountCode">
                        <input type="hidden" id="bypass" value=null>
                        <input id="user" type="hidden" name="user">
                        <section>
                            <div class="drop_in_wrap">
                                <div class="bt-drop-in-wrapper">
                                    <div id="bt-dropin"></div>
                                </div>
                            </div>
                        </section>

                        <div class="button_wrap my_row">
                            <button class="button blue" type="submit"><span>Submit</span></button>
                        </div>
                    </form>
                    <div id="loading_spinner">
                        <img src="{{ asset( 'images/spinner.svg' ) }}" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://js.braintreegateway.com/web/3.82.0/js/venmo.min.js"></script>
    <script src="https://js.braintreegateway.com/web/3.82.0/js/apple-pay.min.js"></script>
    <script src="https://js.braintreegateway.com/web/3.82.0/js/data-collector.min.js"></script>
    <script>
        let spinner = document.querySelector('#loading_spinner');
        var form = document.querySelector('#payment-form');
        var client_token = "{{ $token }}";
        const amount = "{{ $offer->price }}";
        spinner.classList.remove('active');
        braintree.dropin.create({
            authorization: client_token,
            selector: '#bt-dropin',
            paypal: {
                flow: 'vault'
            },
            googlePay: {
                googlePayVersion: 2,
                merchantId: '0764-6991-5982',
                transactionInfo: {
                    totalPriceStatus: 'FINAL',
                    totalPrice: amount,
                    currencyCode: 'USD'
                },
            },
            venmo: {
                allowDesktop: true,
                paymentMethodUsage: 'multi_use',
            },
            applePay: {
                displayName: 'LinkPro',
                paymentRequest: {
                    total: {
                        label: 'LinkPro',
                        amount: amount
                    },
                    // We recommend collecting billing address information, at minimum
                    // billing postal code, and passing that billing postal code with all
                    // Apple Pay transactions as a best practice.
                    requiredBillingContactFields: ["postalAddress"]
                }
            }
        }, function (createErr, instance) {
            if (createErr) {
                console.log('Create Error', createErr);
                return;
            }
            form.addEventListener('submit', function (event) {
                event.preventDefault();

                spinner.classList.add('active');

                const code = document.querySelector('#form_discount_code').value;

                if (code.toLowerCase() === "freepremier" || code.toLowerCase() === "freepro") {
                    form.submit();
                } else {
                    instance.requestPaymentMethod(function(err, payload) {
                        if (err) {
                            console.log('Request Payment Method Error', err);
                            return;
                        }
                        // Add the nonce to the form and submit
                        document.querySelector('#nonce').value = payload.nonce;
                        form.submit();
                    });
                }

            });
        });
    </script>
@endsection
