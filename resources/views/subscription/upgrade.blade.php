@extends('layouts.subscribe.header')

@section('content')

    <div class="container">
        <div class="my_row pricing_plans">
            <div class="mobile_header column plan_items my_row d-block d-md-none">
                <div class="my_row column_sub_header">
                    <p>Choose Your</p>
                    <h2>Pricing Plan</h2>
                </div>
            </div>
            <div class="column plan_items d-none d-md-block">
                <div class="my_row column_header">
                    <img src="{{ asset('images/logo.png') }}" alt="">
                </div>
                <div class="my_row column_sub_header">
                    <p>Choose Your</p>
                    <h2>Pricing Plan</h2>
                </div>
                <div class="my_row column_row">
                    <h4>1 Unique Link</h4>
                </div>
                <div class="my_row column_row alt">
                    <h4>up to 9 icons</h4>
                </div>
                <div class="my_row column_row">
                    <h4>Choose Default Icons</h4>
                </div>
                <div class="my_row column_row alt">
                    <h4>Custom Icon Links</h4>
                </div>
                <div class="my_row column_row">
                    <h4>Custom Icons</h4>
                </div>
                <div class="my_row column_row alt">
                    <h4>Unlimited Icons</h4>
                </div>
                <div class="my_row column_row">
                    <h4>Up to 5 Unique Links</h4>
                </div>
                <div class="my_row column_row alt">
                    <h4>Password Protected Links</h4>
                </div>
                <div class="my_row column_footer">
                    <h5>Questions?</h5>
                    <h5>Contact Us!</h5>
                </div>
            </div>
            <div class="column">
                <div class="my_row column_header basic">
                    <h2>Basic</h2>
                </div>
                <div class="my_row column_sub_header">
                    <h3>$0 <span>/ month</span></h3>
                </div>
                <div class="my_row column_row">
                    <h4>1 Unique Link</h4>
                    <img src="{{ asset('images/check-circle-pink.png') }}" alt="">
                </div>
                <div class="my_row column_row alt">
                    <h4>up to 9 icons</h4>
                    <img src="{{ asset('images/check-circle-pink.png') }}" alt="">
                </div>
                <div class="my_row column_row">
                    <h4>Choose Default Icons</h4>
                    <img src="{{ asset('images/check-circle-pink.png') }}" alt="">
                </div>
                <div class="my_row column_row alt">
                    <h4>Custom Icon Links</h4>
                    <img src="{{ asset('images/check-circle-pink.png') }}" alt="">
                </div>
                <div class="my_row column_row">
                    <h4>Custom Icons</h4>
                    <img src="{{ asset('images/x-circle-pink.png') }}" alt="">
                </div>
                <div class="my_row column_row alt">
                    <h4>Unlimited Icons</h4>
                    <img src="{{ asset('images/x-circle-pink.png') }}" alt="">
                </div>
                <div class="my_row column_row">
                    <h4>Up to 5 Unique Links</h4>
                    <img src="{{ asset('images/x-circle-pink.png') }}" alt="">
                </div>
                <div class="my_row column_row alt">
                    <h4>Password Protected Links</h4>
                    <img src="{{ asset('images/x-circle-pink.png') }}" alt="">
                </div>
                <div class="my_row column_footer">
                    <a class="button green" href="/dashboard/pages/{{$page_id}}">Continue</a>
                </div>
            </div>
            <div class="column">
                <div class="my_row column_header pro">
                    <h2>Pro</h2>
                </div>
                <div class="my_row column_sub_header">
                    <h3>$4.99 <span>/ month</span></h3>
                </div>
                <div class="my_row column_row">
                    <h4>1 Unique Link</h4>
                    <img src="{{ asset('images/check-circle-violet.png') }}" alt="">
                </div>
                <div class="my_row column_row alt">
                    <h4>up to 9 icons</h4>
                    <img src="{{ asset('images/check-circle-violet.png') }}" alt="">
                </div>
                <div class="my_row column_row">
                    <h4>Choose Default Icons</h4>
                    <img src="{{ asset('images/check-circle-violet.png') }}" alt="">
                </div>
                <div class="my_row column_row alt">
                    <h4>Custom Icon Links</h4>
                    <img src="{{ asset('images/check-circle-violet.png') }}" alt="">
                </div>
                <div class="my_row column_row">
                    <h4>Custom Icons</h4>
                    <img src="{{ asset('images/check-circle-violet.png') }}" alt="">
                </div>
                <div class="my_row column_row alt">
                    <h4>Unlimited Icons</h4>
                    <img src="{{ asset('images/check-circle-violet.png') }}" alt="">
                </div>
                <div class="my_row column_row">
                    <h4>Up to 5 Unique Links</h4>
                    <img src="{{ asset('images/x-circle-pink.png') }}" alt="">
                </div>
                <div class="my_row column_row alt">
                    <h4>Password Protected Links</h4>
                    <img src="{{ asset('images/x-circle-pink.png') }}" alt="">
                </div>
                <div class="my_row column_footer">
                    <a class="button pink_gradient" href="/subscribe?plan=pro">Order Now</a>
                </div>
            </div>
            <div class="column">
                <div class="my_row column_header corp">
                    <h2>Corporate</h2>
                </div>
                <div class="my_row column_sub_header">
                    <h3>$19.99 <span>/ month</span></h3>
                </div>
                <div class="my_row column_row">
                    <h4>1 Unique Link</h4>
                    <img src="{{ asset('images/check-circle-blue.png') }}" alt="">
                </div>
                <div class="my_row column_row alt">
                    <h4>up to 9 icons</h4>
                    <img src="{{ asset('images/check-circle-blue.png') }}" alt="">
                </div>
                <div class="my_row column_row">
                    <h4>Choose Default Icons</h4>
                    <img src="{{ asset('images/check-circle-blue.png') }}" alt="">
                </div>
                <div class="my_row column_row alt">
                    <h4>Custom Icon Links</h4>
                    <img src="{{ asset('images/check-circle-blue.png') }}" alt="">
                </div>
                <div class="my_row column_row">
                    <h4>Custom Icons</h4>
                    <img src="{{ asset('images/check-circle-blue.png') }}" alt="">
                </div>
                <div class="my_row column_row alt">
                    <h4>Unlimited Icons</h4>
                    <img src="{{ asset('images/check-circle-blue.png') }}" alt="">
                </div>
                <div class="my_row column_row">
                    <h4>Up to 5 Unique Links</h4>
                    <img src="{{ asset('images/check-circle-blue.png') }}" alt="">
                </div>
                <div class="my_row column_row alt">
                    <h4>Password Protected Links</h4>
                    <img src="{{ asset('images/check-circle-blue.png') }}" alt="">
                </div>
                <div class="my_row column_footer">
                    <a class="button blue_gradient" href="/subscribe/?plan=corp">Order Now</a>
                </div>
            </div>
        </div>
    </div>

@endsection
