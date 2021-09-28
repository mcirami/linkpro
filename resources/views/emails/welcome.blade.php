@component('mail::message')
# Welcome To Link Pro!

<p class="sub_title">You're on your way to becoming a social icon!</p>

<p>Keep your account details handy:</p>
<p class="username">Username: <span>{{ $data['username'] }}</span></p>
<br>
Link: <a href="{{ $data['siteUrl'] }}{{ $data['link'] }}">link.pro/{{ $data['link'] }}</a>

@component('mail::button', ['url' => $data['siteUrl'] ])
Visit WebSite
@endcomponent

Thanks,<br>
<p class="signature">{{ config('app.name') }}</p>
@endcomponent
