@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="my_row form_page plans">
            <div class="card">
                <h2 class="page_title">Update Account Settings</h2>
                @if (count($errors) > 0)
                    <div class="alert alert-danger">
                        <ul>
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                <div class="card-body">
                    <div class="my_row three_columns {{!$subscription ? "two_columns" : ""}}">
                        <div class="column update_info">
                            <h2 class="text-uppercase">Account Info</h2>
                            <form method="POST" action="/update-account/{{ $user->id }}">
                                @csrf
                                    <div class="form_inputs">
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
                                                <small>(Enter password to change it)</small>
                                                @error($errors->has('password'))
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
                            @if( ($subscription && $subscription->braintree_status == "active") || ($subscription && $subscription->braintree_status == "pending") )
                                <div class="plan_name">
                                    <p class="text-capitalize">{{ $subscription->name }}</p>
                                    <img src="{{ asset('../images/plan-type-bg.png') }}" alt="">
                                </div>
                                <a href="#" class="cancel_popup cancel_link" data-plan="{{ $subscription->braintree_id }}" data-type="cancel">Cancel Subscription</a>
                            @elseif($subscription && $subscription->ends_at > \Carbon\Carbon::now())
                                <div class="plan_name">
                                    <p class="text-capitalize">{{ $subscription->name }}</p>
                                    <img src="{{ asset('../images/plan-type-bg.png') }}" alt="">
                                </div>
                                <div class="canceled_text">
                                    <p>Your subscrition has been cancelled. It will end on: <span>{{ \Carbon\Carbon::createFromDate($subscription->ends_at)->format('F j, Y') }}</span></p>
                                </div>
                            @else
                                <div class="plan_name">
                                    <p>Free</p>
                                    <img src="{{ asset('../images/plan-type-bg.png') }}" alt="">
                                </div>
                            @endif
                            @if (($subscription && $subscription->braintree_status == "active") || ($subscription && $subscription->braintree_status == "pending"))
                                <button class='button blue open_popup_choose'>
                                    Change My Plan
                                </button>
                            @elseif($subscription && $subscription->ends_at > \Carbon\Carbon::now())
                                <form action="{{ route('subscribe.resume') }}" method="post">
                                    @csrf
                                    <input name="payment_method_token" type="hidden" value="{{$payment_method_token}}"/>
                                    <input class="level" name="planId" type="hidden" value="{{$subscription->name}}">
                                    <button type="submit" class='button blue'>
                                        Resume
                                    </button>
                                </form>

                            @else
                                <a class='button blue' href="{{ route('plans.get') }}">
                                    Change My Plan
                                </a>
                            @endif
                        </div>
                        @if ($subscription)
                            <div class="column">
                                <h2 class="text-uppercase">Billing Info</h2>
                                @if (strtolower($payment_method) == "card" || strtolower($payment_method) == "credit_card")
                                    <form id="update-cc-form" method="post" action="{{ route('user.update.card') }}">
                                        @csrf
                                        <h4>Your current payment type is</h4>
                                        <input id="nonce" name="payment_method_nonce" type="hidden" />
                                            <div class="form-group row form_inputs mt-0 mb-1">
                                                <div class="col-12">
                                                    <label for="card-number">Card Number</label>
                                                    <div class="form-group" id="card-number"></div>
                                                    {{--<input type="text" value="" placeholder="xxxx xxxx xxxx {{$user["pm_last_four"]}}">--}}
                                                </div>
                                            </div>
                                            <div class="form-group row form_inputs mb-1">
                                                <div class="col-7">
                                                    <label for="expiration-date">Expiration Date</label>
                                                    <div class="form-group" id="expiration-date"></div>
                                                </div>
                                                <div class="col-5">
                                                    <label for="cvv">CVV <span>(3 digits)</span></label>
                                                    <div class="form-group" id="cvv"></div>
                                                </div>
                                            </div>
                                            <div class="form-group row form_inputs">
                                                <div class="col-12">
                                                    <label for="postal-code">Postal Code</label>
                                                    <div id="postal-code" class="hosted-field"></div>
                                                </div>
                                            </div>
                                            @error('card')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $errors->first('card')  }}</strong>
                                                </span>
                                            @enderror
                                            <div class="form-group row form_buttons">
                                                <div class="col-12">
                                                    <button type="submit" class="button blue text-uppercase">
                                                        {{ __('Update Card') }}
                                                    </button>
                                                </div>
                                            </div>
                                    </form>
                                @else

                                    <div class="other_methods text-center my-auto">
                                        <h4>Your current payment type is</h4>
                                        @if( strtolower($payment_method) == "paypal" || strtolower($payment_method) == "paypal_account")
                                            <a href="https://paypal.com" class="px-5 d-block" target="_blank">
                                                <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_200x51.png" alt="PayPal" />
                                            </a>
                                        @elseif(strtolower($payment_method) == "android_pay_card" || strtolower($payment_method) == "googlepay")
                                            <a href="https://pay.google.com/" class="px-5 d-block" target="_blank">
                                                <img src="{{ asset('../images/googlepay.png') }}" alt="GooglePay" />
                                            </a>
                                        @elseif(strtolower($payment_method) == "venmo_account")
                                            <a href="https://venmo.com/" class="px-5 d-block" target="_blank">
                                                <img src="{{ asset('../images/venmo.png') }}" alt="Venmo" />
                                            </a>
                                        @endif
                                    </div>

                                @endif

                                <a href="#" class="button blue text-uppercase open_payment_method">
                                    {{ __('Change Payment Method') }}
                                </a>
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
        </div>
    @endif

    @if($subscription)

        @include('layouts.popupPaymentMethod')

        @if ($subscription->braintree_status == "active" || $subscription->braintree_status == "pending")

            @include('layouts.popupCancel')
            @include('layouts.popupChooseLevel')

        @endif

    @endif

    @if ($payment_method == "card")

        <script src="https://js.braintreegateway.com/web/3.38.1/js/client.min.js"></script>
        <script src="https://js.braintreegateway.com/web/3.38.1/js/hosted-fields.min.js"></script>

        <!-- Load PayPal's checkout.js Library. -->
        <script src="https://www.paypalobjects.com/api/checkout.js" data-version-4 log-level="warn"></script>

        <!-- Load the PayPal Checkout component. -->
        <script src="https://js.braintreegateway.com/web/3.38.1/js/paypal-checkout.min.js"></script>
        <script>
            var updateForm = document.querySelector('#update-cc-form');
            if(updateForm) {
                var submit = document.querySelector('input[type="submit"]');
                braintree.client.create({
                    authorization: '{{ $token }}'
                }, function(clientErr, clientInstance) {
                    if (clientErr) {
                        console.error(clientErr);
                        return;
                    }
                    // This example shows Hosted Fields, but you can also use this
                    // client instance to create additional components here, such as
                    // PayPal or Data Collector.
                    braintree.hostedFields.create({
                        client: clientInstance,
                        styles: {
                            'input': {
                                'font-size': '14px'
                            },
                            'input.invalid': {
                                'color': 'red'
                            },
                            'input.valid': {
                                'color': 'green'
                            }
                        },
                        fields: {
                            number: {
                                selector: '#card-number',
                                placeholder: 'xxxx xxxx xxxx ' + '{{ $user["pm_last_four"] }}',
                            },
                            cvv: {
                                selector: '#cvv',
                                placeholder: 'xxx'
                            },
                            expirationDate: {
                                selector: '#expiration-date',
                                placeholder: 'MM/YYYY'
                            },
                            postalCode: {
                                selector: '#postal-code',
                                placeholder: 'xxxxx',
                            }
                        }
                    }, function(hostedFieldsErr, hostedFieldsInstance) {
                        if (hostedFieldsErr) {
                            console.error(hostedFieldsErr);
                            return;
                        }
                        // submit.removeAttribute('disabled');
                        updateForm.addEventListener('submit', function(event) {
                            event.preventDefault();
                            hostedFieldsInstance.tokenize(function(tokenizeErr, payload) {
                                if (tokenizeErr) {
                                    console.error(tokenizeErr);
                                    return;
                                }
                                // If this was a real integration, this is where you would
                                // send the nonce to your server.
                                // console.log('Got a nonce: ' + payload.nonce);
                                document.querySelector('#nonce').value = payload.nonce;
                                updateForm.submit();
                            });
                        }, false);
                    });
                });
            }
        </script>
    @endif

@endsection
