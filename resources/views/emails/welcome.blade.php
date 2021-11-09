@component('mail::message', ['id' => $data['userID'], 'url' => $data['siteUrl']])
# Welcome To LinkPro!

<p class="sub_title">You're on your way to becoming a social icon!</p>

<p>Keep your account details handy:</p>
<p class="username">Username: <span>{{ $data['username'] }}</span></p>
<br>
Link: <a href="{{ $data['siteUrl'] }}/{{ $data['link'] }}">{{ $data['siteUrl'] }}/{{ $data['link'] }}</a>

@component('mail::button', ['url' => $data['siteUrl'] . "/login" ])
Login Now
@endcomponent

<p class="sign_off">To Your Success!</p>
<p class="signature">The LinkPro Team</p
@endcomponent
