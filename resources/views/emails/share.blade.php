@component('mail::message')
# Hi {{ $data['username'] }}!

Thanks for using LinkPro!
<br>
We Just wanted to give you some tips on how to utilize your link as much as possible.
We suggest you share your link on Facebook, Instagram, Tiktok and any other social media you use.
<br>
<br>
Copy your link below and start sharing:
<p>Link: <a href="{{ $data['siteUrl'] }}{{ $data['link'] }}">link.pro/{{ $data['link'] }}</a></p>

@component('mail::button', ['url' => $data['siteUrl'] ])
    Visit WebSite
@endcomponent

Thanks,<br>
<p class="signature">{{ config('app.name') }}</p>
@endcomponent
