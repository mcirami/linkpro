@component('mail::message', ['id' => $data['userID'], 'url' => $data['siteUrl']])
# Heya {{ $data['username'] }}!

Are you taking advantage of the cool new link you created? <br>Make sure to post your unique LinkPro link:
<br>
<p><a href="{{ $data['siteUrl'] }}/{{ $data['link'] }}">{{ $data['siteUrl'] }}/{{ $data['link'] }}</a></p>
On all of your social pages.<br> Let your fans know where you are and what you are up to at all times!
@component('mail::button', ['url' => $data['siteUrl'] . "/login" ])
    Login Now
@endcomponent

<p class="sign_off">To Your Success!</p>
<p class="signature">The LinkPro Team</p>
@endcomponent
