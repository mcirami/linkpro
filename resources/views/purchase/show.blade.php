@extends('layouts.course.header')

@section('content')

    <div class="container" id="contact_page">
        <div class="my_row form_page checkout">
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
                    <div class="text_wrap text-center">
                        <h3>You are purchasing {{$courseTitle}} course for ${{$offer->price}}</h3>
                    </div>
                    <form method="post" id="payment-form" action="{{ route('course.purchase') }}">
                        @csrf
                        <section>
                            <input type="hidden" name="level" value="">
                            <input type="hidden" name="offer" value="{{$offer->id}}">
                            <input id="form_discount_code" type="hidden" name="discountCode">
                            <input type="hidden" id="bypass" value=null>
                            <div class="drop_in_wrap">
                                <div class="bt-drop-in-wrapper">
                                    <div id="bt-dropin"></div>
                                </div>
                            </div>
                        </section>

                        <input id="nonce" name="payment_method_nonce" type="hidden" />
                        <button class="button blue" type="submit"><span>Submit</span></button>
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
