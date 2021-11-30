@component('mail::message', ['id' => $data['userID'], 'url' => $data['siteUrl']])
# Welcome Back!

We are glad you decided to stick with us!
<br>
To refresh your memory, here's your account details again:
<br>
<p class="username">Username: <span>{{ $data['username'] }}</span></p>
<br>
Link: <a href="{{ $data['siteUrl'] }}/{{ $data['link'] }}">{{ $data['siteUrl'] }}/{{ $data['link'] }}</a>
@if($data['billingDate'] )
<br>
<br>
Your next billing date hasn't changed. You are set to be billed on:
<br>
{{ $data['billingDate'] }}
@endif
<br>
@component('mail::button', ['url' => $data['siteUrl'] . "/login" ])
Login Now
@endcomponent

<p class="sign_off">To Your Success!</p>
<p class="signature">The LinkPro Team</p>

@endcomponent
