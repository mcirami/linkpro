@extends('layouts.subscribe.header')

@section('content')
    <div class="my_row form_page checkout">
        <div class="card">
            <div>
                <h3>Upgrade Now to Get All The Benefits!</h3>
            </div>

            <div class="card-body">
                <form id="payment-form" action="{{ route('subscribe.post') }}" method="post" data-secret="{{ $intent->client_secret }}">
                    @csrf
                    <div class="form-group row">
                        <div class="col-12">
                            <input type="text" id="cardholder-name" name="cardholder-name">
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-12">
                            <input type="radio" name="plan" data-level="standard" id="standard" value="price_1JS1p5GIBktjIJUPjG5ksGFb" checked>
                            <label for="standard">Standard - $4.99/month</label> <br>
                            <input type="radio" name="plan" data-level="premium" id="premium" value="price_1JS1qkGIBktjIJUPVSjN20LH">
                            <label for="premium">Premium - $19.99/month</label>
                        </div>
                    </div>
                    <div id="card-element">
                        <!-- Elements will create input elements here -->
                    </div>

                    <!-- We'll put the error messages in this element -->
                    <div id="card-errors" role="alert"></div>

                    <button class="button blue">
                        <div class="spinner hidden" id="spinner"></div>
                        Submit Payment
                    </button>
                </form>
            </div>
        </div>
    </div>
@endsection
