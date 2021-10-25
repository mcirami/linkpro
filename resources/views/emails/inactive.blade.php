@component('mail::message', ['id' => $data['userID'], 'url' => $data['siteUrl']])
# Hey there fellow LinkPro Icon!
<br>
We don’t want to bug you but we noticed you haven’t published any of your social links in your account. Need some help? Follow the link below to learn the process!
<br>
<a href="{{ $data['siteUrl'] }}setup">{{ $data['siteUrl'] }}setup</a>
<br>
<br>
To refresh your memory, here are your account details:
<br>
<p class="username">Username: <span>{{ $data['username'] }}</span></p>
<p>Link: <a href="{{ $data['siteUrl'] }}{{ $data['link'] }}">{{ $data['siteUrl'] }}{{ $data['link'] }}</a></p>

Happy page building!

@component('mail::button', ['url' => $data['siteUrl'] . "login" ])
    Login Now
@endcomponent

<p class="sign_off">To your success!</p>
<p class="signature">The LinkPro Team</p>
@endcomponent
