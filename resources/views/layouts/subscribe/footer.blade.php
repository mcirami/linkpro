<footer>
    <ul>
        <li><a href="#">Contact</a></li>
        <li><a href="{{ route('user.edit') }}">Account</a></li>
        <li><a href="{{ route('plans.get') }}">Upgrade</a></li>
    </ul>
    <small>&copy; Copyright Link Pro LLC | All Rights Reserved</small>
</footer>

<script src="https://js.stripe.com/v3/"></script>
<script>
    var stripe = Stripe('{{ env("STRIPE_KEY") }}', { locale: 'en' });
    var elements = stripe.elements();
    // Set up Stripe.js and Elements to use in checkout form
    var style = {
        base: {
            color: "#32325d",
        }
    };

    var card = elements.create("card", { style: style });
    card.mount("#card-element");

    card.on('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });

    let form = document.getElementById('payment-form');
    const cardHolderName = document.getElementById('cardholder-name');
    const clientSecret = form.dataset.secret;

    form.addEventListener('submit', async function(ev) {
       ev.preventDefault();
        document.querySelector("#spinner").classList.remove("hidden");

        const { setupIntent, error } = await stripe.confirmCardSetup(
            clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: { name: cardHolderName.value }
                }
            }
        );

        if (error) {
            // Inform the user if there was an error.
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = error.message;
            document.querySelector("#spinner").classList.add("hidden");
        } else {
            // Send the token to your server.
            //console.log(setupIntent);
            stripeTokenHandler(setupIntent);
        }

    });

    function stripeTokenHandler(setupIntent) {
        // Insert the token ID into the form so it gets submitted to the server
        var form = document.getElementById('payment-form');
        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'paymentMethod');
        hiddenInput.setAttribute('value', setupIntent.payment_method);
        form.appendChild(hiddenInput);

        let planLevel;
        const radios = document.getElementsByName('plan');
        for (i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                planLevel = radios[i].dataset.level;
            }
        }

        var hiddenInputLevel = document.createElement('input');
        hiddenInputLevel.setAttribute('type', 'hidden');
        hiddenInputLevel.setAttribute('name', 'level');
        hiddenInputLevel.setAttribute('value', planLevel);
        form.appendChild(hiddenInputLevel);


        // Submit the form
        form.submit();
    }

</script>
