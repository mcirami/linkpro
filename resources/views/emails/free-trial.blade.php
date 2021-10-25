@component('mail::message', ['id' => $data['userID'], 'url' => $data['siteUrl']])
    # Heya {{ $data['username'] }}!

    We want to offer you a FREE month when you upgrade to our PRO plan!
    <br>
    Click the link below and login, then click 'Have a Promo Code?' and enter the code: <strong>ProOneMonth</strong>
    <br>
    <p><a href="{{ $data['siteUrl'] }}subscribe?plan=pro">Go Pro Now!</a></p>

    @component('mail::button', ['url' => $data['siteUrl'] . "login" ])
        Login Now
    @endcomponent

    <p class="sign_off">To your success!</p>
    <p class="signature">The LinkPro Team</p>
@endcomponent
