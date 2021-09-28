@component('mail::message')
We are certainly sad to see you go but want to thank you for your participation! If there is anything we can do to make you reconsider, please let us know! If not, make sure to stay out there crushing it!
<br>
<br>
Your subscription is set to end on <span class="date">{{ $data["end_date"] }}</span>
<br>
<br>
Take advantage of the rest of the time you have!
<br>
You can always resume your subscription at any time before it expires.

@component('mail::button', ['url' => $data['siteUrl'] . "login" ])
    Login Now
@endcomponent

<p class="sign_off">To your success!</p>
<p class="signature">The LinkPro Team</p>
@endcomponent
