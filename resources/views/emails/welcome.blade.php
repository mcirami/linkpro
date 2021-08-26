@component('mail::message')
# Welcome To Link Pro!

We are glad you joined us. Get started now!

Email: {{ $data['email'] }}
<br>
Username: {{ $data['username'] }}

@component('mail::button', ['url' => 'https://link.pro'])
Visit Site
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
