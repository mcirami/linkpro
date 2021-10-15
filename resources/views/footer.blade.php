<?php
?>
@if(Route::is('create.page'))
    <footer>
        <ul>
            <li><a class="open_popup" href="#">How It Works</a></li>
            <li><a class="open_popup" href="/login">Login</a></li>
            <li><a class="open_popup" href="/register">Sign Up</a></li>
        </ul>
        <small>&copy; Copyright Link Pro LLC | All Rights Reserved</small>
    </footer>
@else
    <footer>
        <ul>
            <li><a href="#">Contact</a></li>
            <li><a href="{{ route('user.edit') }}">Settings</a></li>
            @php $userSub = Auth::user()->subscriptions()->first(); @endphp

            @if( empty($userSub) || $userSub->name != "premier" || $userSub->ends_at && $userSub->ends_at < \Carbon\Carbon::now())
                <li><a href="{{ route('plans.get') }}">Upgrade</a></li>
            @endif
        </ul>
        <small>&copy; Copyright Link Pro LLC | All Rights Reserved</small>
    </footer>
@endif


