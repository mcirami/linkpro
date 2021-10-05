<div id="popup_payment_method"  class="form_page checkout">
    <a class="close_popup" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
    </a>
    <div class="box">
        <div class="content_wrap">
            <h3>Change Your Payment Method</h3>
            <div class="text_wrap form_wrap">
                <form id="update_payment_method_form" action="{{ route('user.update.payment') }}" method="post" >
                    @csrf
                    <div class="bt-drop-in-wrapper">
                        <div id="bt-dropin-update"></div>
                    </div>
                    <input id="method_nonce" name="payment_method_nonce" type="hidden"/>
                    <button type="submit" class='button blue'>
                        Submit
                    </button>
                </form>

            </div>
        </div>
    </div>
</div>

<script>
    var updatePaymentForm = document.querySelector('#update_payment_method_form');
    var client_token = "{{ $token }}";
    braintree.dropin.create({
        authorization: client_token,
        selector: '#bt-dropin-update',
        paypal: {
            flow: 'vault'
        }
    }, function (createErr, instance) {
        if (createErr) {
            console.log('Create Error', createErr);
            return;
        }
        updatePaymentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            instance.requestPaymentMethod(function (err, payload) {
                if (err) {
                    console.log('Request Payment Method Error', err);
                    return;
                }
                // Add the nonce to the form and submit
                document.querySelector('#method_nonce').value = payload.nonce;
                updatePaymentForm.submit();
            });
        });
    });
</script>
