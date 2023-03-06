@component('mail::message-course', ['landingPageData' => $data['landingPageData'], 'loginLink' => config('app.url') . '/' . $data['creator'] . '/course/login'])
# Welcome!

<p class="sub_title">Thanks for registering for {{ $data['courseTitle'] }} course!</p>

<p>Keep your account details handy:</p>
<p class="username">Username: <span>{{ $data['username'] }}</span></p>
<br>

@component('mail::button-course', ['url' => config('app.url') . '/' . $data['creator'] . '/course/login',
'backgroundColor' =>  $data['landingPageData']['button_color'],
'buttonTextColor' => $data['landingPageData']['button_text_color'] ])
Login Now
@endcomponent

<p class="sign_off">To Your Success!</p>
<p class="signature">{{ $data['creator'] }}</p>
@endcomponent
