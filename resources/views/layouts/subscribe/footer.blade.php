<footer>
    <ul>
        <li><a href="#">Contact</a></li>
        <li><a href="{{ route('user.edit') }}">Settings</a></li>
        <li><a href="{{ route('plans.get') }}">Upgrade</a></li>
    </ul>
    <small>&copy; Copyright Link Pro LLC | All Rights Reserved</small>
</footer>

<script src="https://js.stripe.com/v3/"></script>
<script>
    window.onload = function() {
        var stripe = Stripe('{{ env("STRIPE_KEY") }}', { locale: 'en' });
        var elements = stripe.elements();
        let form = document.getElementById('payment-form');
        const cardHolderName = document.getElementById('cardholder-name');
        const clientSecret = form.dataset.secret;

        const radios = document.getElementsByName('plan');

        let planAmount = getPlanAmount();

        let buttonForm = document.getElementById('payment-button-form');

        for (i = 0; i < radios.length; i++) {
            radios[i].addEventListener('change', function() {
                //planAmount = parseInt(this.dataset.price);
                paymentRequest.total.amount = parseInt(this.dataset.price);
            })
        }

        // Set up Stripe.js and Elements to use in checkout form
        var style = {
            base: {
                color: "#32325d",
            }
        };

        var paymentRequest = stripe.paymentRequest({
            country: 'US',
            currency: 'usd',
            total: {
                label: 'LinkPro Subscription Price',
                amount: planAmount,
            },
            requestPayerName: true,
            requestPayerEmail: true,
        });

        console.log(paymentRequest);

        var prButton = elements.create('paymentRequestButton', {
            paymentRequest: paymentRequest,
        });

        // Check the availability of the Payment Request API first.
        paymentRequest.canMakePayment().then(function(result) {
            if (result) {
                prButton.mount('#payment-request-button');
                buttonForm.addEventListener('submit');
            } else {
                document.getElementById('payment-request-button').style.display = 'none';
            }
        });

        paymentRequest.on('paymentmethod', function(ev) {
            // Confirm the PaymentIntent without handling potential next actions (yet).
            const setupIntent =  stripe.confirmCardPayment(
                clientSecret,
                {payment_method: ev.paymentMethod.id},
                {handleActions: false}
            ).then(function(confirmResult) {
                if (confirmResult.error) {
                    // Report to the browser that the payment failed, prompting it to
                    // re-show the payment interface, or show an error message and close
                    // the payment interface.
                    ev.complete('fail');
                } else {
                    // Report to the browser that the confirmation was successful, prompting
                    // it to close the browser payment method collection interface.
                    ev.complete('success');
                    // Check if the PaymentIntent requires any actions and if so let Stripe.js
                    // handle the flow. If using an API version older than "2019-02-11"
                    // instead check for: `paymentIntent.status === "requires_source_action"`.
                    if (confirmResult.paymentIntent.status === "requires_action") {
                        // Let Stripe.js handle the rest of the payment flow.
                        stripe.confirmCardPayment(clientSecret).then(function(result) {
                            if (result.error) {
                                // The payment failed -- ask your customer for a new payment method.
                            } else {
                                // The payment has succeeded.
                                var hiddenInput = document.createElement('input');
                                hiddenInput.setAttribute('type', 'hidden');
                                hiddenInput.setAttribute('name', 'paymentMethod');
                                hiddenInput.setAttribute('value', setupIntent.payment_method);
                                buttonForm.appendChild(hiddenInput);

                                let planLevel = getPlanLevel();

                                var hiddenInputLevel = document.createElement('input');
                                hiddenInputLevel.setAttribute('type', 'hidden');
                                hiddenInputLevel.setAttribute('name', 'level');
                                hiddenInputLevel.setAttribute('value', planLevel);
                                buttonForm.appendChild(hiddenInputLevel);

                                var hiddenPlanInput = document.createElement('input');
                                hiddenInput.setAttribute('type', 'hidden');
                                hiddenInput.setAttribute('name', 'plan');
                                hiddenInput.setAttribute('value', planAmount);
                                buttonForm.appendChild(hiddenPlanInput);

                                buttonForm.submit();
                            }
                        });
                    } else {
                        // The payment has succeeded.
                        var hiddenInput = document.createElement('input');
                        hiddenInput.setAttribute('type', 'hidden');
                        hiddenInput.setAttribute('name', 'paymentMethod');
                        hiddenInput.setAttribute('value', setupIntent.payment_method);
                        buttonForm.appendChild(hiddenInput);

                        let planLevel = getPlanLevel();

                        var hiddenInputLevel = document.createElement('input');
                        hiddenInputLevel.setAttribute('type', 'hidden');
                        hiddenInputLevel.setAttribute('name', 'level');
                        hiddenInputLevel.setAttribute('value', planLevel);
                        buttonForm.appendChild(hiddenInputLevel);

                        var hiddenPlanInput = document.createElement('input');
                        hiddenInput.setAttribute('type', 'hidden');
                        hiddenInput.setAttribute('name', 'plan');
                        hiddenInput.setAttribute('value', planAmount);
                        buttonForm.appendChild(hiddenPlanInput);

                        buttonForm.submit();
                    }
                }
            });
        });

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

            let planLevel = getPlanLevel();

            var hiddenInputLevel = document.createElement('input');
            hiddenInputLevel.setAttribute('type', 'hidden');
            hiddenInputLevel.setAttribute('name', 'level');
            hiddenInputLevel.setAttribute('value', planLevel);
            form.appendChild(hiddenInputLevel);

            var hiddenPlanInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'plan');
            hiddenInput.setAttribute('value', planAmount);
            buttonForm.appendChild(hiddenPlanInput);

            // Submit the form
            form.submit();
        }

        function getPlanLevel() {
            let planLevel;
            for (i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    planLevel = radios[i].dataset.level;
                }
            }

            return planLevel;
        }

        function getPlanAmount() {
            let amount;
            for (i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    amount = radios[i].dataset.price;
                }
            }
            return parseInt(amount);
        }
    }

</script>
