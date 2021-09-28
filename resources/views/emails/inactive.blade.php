@component('mail::message')
# Hi {{ $data['username'] }}!

Looks like you created your link on LinkPro but you forgot to add icons. That was silly of you! ;p
<br>
To refresh your memory, here are your account details:
<p class="username">Username: <span>{{ $data['username'] }}</span></p>
<p>Link: <a href="{{ $data['siteUrl'] }}{{ $data['link'] }}">link.pro/{{ $data['link'] }}</a></p>

We hope to see you in there soon to put your awesome link to use!

@component('mail::button', ['url' => $data['siteUrl'] ])
    Visit WebSite
@endcomponent

Thanks,<br>
<p class="signature">{{ config('app.name') }}</p>
@endcomponent
