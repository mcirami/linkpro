@component('mail::message')

# A new user has submitted a {{$reason}} inquiry.

<br>
Name: {{$name}}
<br>
Email: {{$email}}
    <br>
Reason: {{$reason}}
<br>
Meassage: {{$message}}
<br>
<br>
<p class="signature">The LinkPro Team</p>

@endcomponent
