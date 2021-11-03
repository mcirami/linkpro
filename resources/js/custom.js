'use strict'
jQuery(document).ready(function($) {


    const box = document.querySelector('.links_wrap.preview');
    const innerContent = document.getElementById('preview_wrap');


    if (box) {
        let windowWidth = $(window).outerWidth();
        const width = box.offsetWidth;
        const height = box.offsetHeight;
        const diff = Math.floor(.0915033 * width);

        if (windowWidth < 993) {
            innerContent.style.maxHeight = "825px";
            innerContent.style.maxWidth = "385px";
        } else if (windowWidth < 1010 ) {
            innerContent.style.maxHeight = (width * 2) - 30 + "px";
            innerContent.style.maxWidth = width - diff + "px";
        } else if (windowWidth < 1100 ) {
            innerContent.style.maxHeight = (width * 2) - 20 + "px";
            innerContent.style.maxWidth = width - diff + "px";
        } else {
            innerContent.style.maxHeight = "825px";
            innerContent.style.maxWidth = "385px";
        }

        $(window).on('resize', function() {

            windowWidth = $(window).outerWidth();
            const height = box.offsetHeight;
            const width = box.offsetWidth;
            const diff = Math.floor(.0915033 * width);

            if (windowWidth < 993) {
                innerContent.style.maxHeight = "825px";
                innerContent.style.maxWidth = "385px";
            } else if (windowWidth < 1010 ) {
                innerContent.style.maxHeight = (width * 2) - 30 + "px";
                innerContent.style.maxWidth = width - diff + "px";
            } else if (windowWidth < 1100 ) {
                innerContent.style.maxHeight = (width * 2) - 20 + "px";
                innerContent.style.maxWidth = width - diff + "px";
            } else {
                innerContent.style.maxHeight = "825px";
                innerContent.style.maxWidth = "385px";
            }

        });
    }

    const flashMessage = document.getElementById('laravel_flash');

    if (flashMessage) {

        setTimeout(function() {
            let fadeEffect = setInterval(function() {
                if (!flashMessage.style.opacity) {
                    flashMessage.style.opacity = 1;
                }
                if (flashMessage.style.opacity > 0) {
                    flashMessage.style.opacity -= .1;
                } else {
                    clearInterval(fadeEffect);
                }
            },200)
        }, 3000)
    }

    const confirmPopup = document.getElementById('confirm_popup');

    if (confirmPopup) {
        const openPopupButton = document.querySelectorAll('.open_popup');
        openPopupButton.forEach((button) => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const planName = e.target.dataset.plan;
                const type = e.target.dataset.type;
                const level = e.target.dataset.level;
                confirmPopup.classList.add('open');

                document.querySelector('#confirm_popup .plan').value = planName;
                document.querySelector('#confirm_popup .level').value = level;

                switch (type) {
                    case 'cancel':
                        document.querySelector('#popup_form').action = '/subscribe/cancel';
                        document.querySelector('#confirm_popup #text_type').textContent = 'cancel';
                        break;
                    case 'upgrade':
                        document.querySelector('#popup_form').action = '/change-plan';
                        document.querySelector('#confirm_popup #text_type').textContent = 'upgrade';
                        break;
                    default:
                        console.log('Default');
                }

            });
        })

        document.querySelector('#confirm_popup .close_popup').addEventListener('click', function(e) {
            e.preventDefault();
            confirmPopup.classList.remove('open');
        })
    }

    const chooseLevelPopup = document.getElementById('popup_choose_level');

    if (chooseLevelPopup) {
        if (document.querySelector('.open_popup_choose')) {
            document.querySelector('.open_popup_choose').
                addEventListener('click', function(e) {
                    e.preventDefault();
                    chooseLevelPopup.classList.add('open');
                });
        }

        document.querySelector('#popup_choose_level .close_popup').addEventListener('click', function(e) {
            e.preventDefault();

            const changePlanDetails = document.querySelector('#confirm_change_plan_details');
            const confirmCancelDetails = document.querySelector('#confirm_cancel_details');

            if(changePlanDetails.classList.contains("open")) {
                changePlanDetails.classList.remove('open');
            }

            if(confirmCancelDetails.classList.contains('open')) {
                confirmCancelDetails.classList.remove('open');
            }

            chooseLevelPopup.classList.remove('open');
            document.querySelector('#popup_choose_level .box').classList.remove('size_adjust');
        });
    }

    const paymentMethodPopup = document.getElementById('popup_payment_method');

    if (paymentMethodPopup) {
        document.querySelector('.open_payment_method').addEventListener('click', function(e){
            e.preventDefault();
            paymentMethodPopup.classList.add('open');
        });

        document.querySelector('#popup_payment_method .close_popup').addEventListener('click', function(e) {
            e.preventDefault();
            paymentMethodPopup.classList.remove('open');
        })
    }

    const confirmCancelPopup = document.getElementById('confirm_cancel_popup');

    if (confirmCancelPopup) {
        document.querySelector('.cancel_popup').addEventListener('click', function(e) {
            e.preventDefault();
            confirmCancelPopup.classList.add('open');
        });

        document.querySelector('#confirm_cancel_popup .close_popup').addEventListener('click', function(e) {
            e.preventDefault();
            confirmCancelPopup.classList.remove('open');
        });
    }

    const discountLink = document.querySelector('.discount_link');

    if (discountLink) {
        discountLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.discount_wrap').classList.add('open');
        });
    }

    $('.mobile_menu_icon').click(function(e){
        //e.preventDefault();
        $(this).toggleClass('open');
        $('.menu').toggleClass('open');
        $('.nav_links_wrap').toggleClass('open');
        $('.nav_row').toggleClass('fixed');
    });

});
