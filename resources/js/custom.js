'use strict'
import axios from 'axios';
import EventBus from './Utils/Bus';

jQuery(document).ready(function($) {

    const box = document.querySelector('.inner_content_wrap');
    const innerContent = document.getElementById('preview_wrap');


    if (box) {


        /*const innerWrap = document.querySelector('#links_page .links_col .links_wrap.preview .inner_content');
        const rightCol = document.querySelector('.right_column.links_col.preview').clientWidth;
        const percentage = (rightCol/2.2) / 1000;
        const widthDiff = rightCol * percentage;
        const maxColWidth = rightCol - widthDiff - 20 + "px";
        innerWrap.style.maxWidth = maxColWidth;*/

       /* const diff = 0.048461 * innerContent.clientHeight;
        box.style.maxHeight = innerContent.clientHeight - diff + "px";*/
        let pixelsToMinus = 0;
        if (window.outerWidth > 550) {
            pixelsToMinus = 35;
        } else {
            pixelsToMinus = 25;
        }

        box.style.maxHeight = innerContent.clientHeight - pixelsToMinus + "px";

        $(window).on('resize', function() {

           /* const innerWrap = document.querySelector('#links_page .links_col .links_wrap.preview .inner_content');
            const rightCol = document.querySelector('.right_column.links_col.preview').clientWidth;
            const percentage = (rightCol/1.6) / 1000;
            const widthDiff = rightCol * percentage;
            const maxColWidth = rightCol - widthDiff - 20;
            innerWrap.style.maxWidth = maxColWidth + "px";*/

            //const diff = 0.048461 * innerContent.clientHeight;
            //box.style.maxHeight = innerContent.clientHeight - diff + "px";

            let pixelsToMinus = 0;
            if (window.outerWidth > 550) {
                pixelsToMinus = 35;
            } else {
                pixelsToMinus = 25;
            }

            box.style.maxHeight = innerContent.clientHeight - pixelsToMinus + "px";

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

    const promoCodeForm = document.querySelector('#submit_discount_code');
    if (promoCodeForm) {
        promoCodeForm.addEventListener('submit', function(event) {
            event.preventDefault();
            document.querySelector('#promo_success_message').classList.remove('active');
            document.querySelector('#promo_error_message').classList.remove('active');
            document.querySelector('#payment-form').classList.remove('adjust');
            const code = document.querySelector('#discount_code').value;
            const codePlan = document.querySelector('#code_plan').value;
            const packets = {
                planId: codePlan,
                code: code
            }

            axios.post("/subscribe/check-code", packets)
            .then(
                (response) => {
                    //console.log(JSON.stringify(response.data))
                    const message = response.data.message;
                    const success = response.data.success;

                    if (success) {
                        let successDiv = document.querySelector('#promo_success_message');
                        if (message.includes("Lifetime")) {
                            document.querySelector('#payment-form .bt-drop-in-wrapper').remove();
                            document.querySelector('#payment-form #nonce').remove();
                            successDiv.innerHTML = "<p class='success'>" + message  + "</p>";
                        } else {
                            document.querySelector('#payment-form').classList.add('adjust');
                            successDiv.innerHTML =
                                "<p class='success'>" + message  + "</p>" +
                                "<p><span>NEXT:</span> Choose a way to pay for future billing. If you cancel before the next billing cycle you will never be charged.</p>"
                        }

                        successDiv.classList.add('active');

                        document.querySelector('#form_discount_code').value = code;
                    } else {
                        const errorDiv = document.querySelector('#promo_error_message');
                        errorDiv.innerHTML = "<p class='error'>" + message + "</p>";
                        errorDiv.classList.add('active');
                    }

                }
            )
            .catch((error) => {
                if (error.response !== undefined) {
                    console.log("ERROR:: ", error.response.data);
                } else {
                    console.log("ERROR:: ", error);
                }

                return {
                    success : false,
                }

            });

        })
    }

    $('.mobile_menu_icon').click(function(e){
        //e.preventDefault();
        $(this).toggleClass('open');
        $('.nav_links_wrap').toggleClass('open');

        setTimeout(function() {
            $('.nav_row').toggleClass('fixed');
        }, 500);
    });

    $(window).on('resize', function() {

        const mobileMenuIcon = $('.mobile_menu_icon');
        if ( mobileMenuIcon.hasClass('open') && window.outerWidth > 768) {
            mobileMenuIcon.removeClass('open');
            $('.nav_links_wrap').removeClass('open');
            $('.nav_row').removeClass('fixed');
        }

    });

    // prevent click if no url or image on preview icon
    const defaultIcons = document.querySelectorAll('a.default');
    if (defaultIcons.length > 0) {
        defaultIcons.forEach(element => {
            element.addEventListener('click', function(e) {
                e.preventDefault();
            })
        })
    }

    function insertContent(content, element, cb) {

        const childNum = element.dataset.row * 4;
        let iconsWrap = null;
        iconsWrap = document.querySelectorAll(
            '.icons_wrap.main > .icon_col:nth-child(' + childNum + ')');
        if (iconsWrap.length < 1) {
            iconsWrap = document.querySelectorAll(
                '.icons_wrap.main > .icon_col:last-child');
        }
        iconsWrap[0].after(content);
        cb();
    }

    const folders = document.querySelectorAll('.icon_col.folder');
    if (folders.length > 0) {
        let content = null;
        folders.forEach((element) => {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                if (content) {
                    if (element.classList.contains('open')) {
                        content.classList.toggle('open');
                        element.classList.toggle('open');
                        const lastChild = element.lastElementChild;
                        lastChild.after(content);
                        content = null;
                    } else {
                        document.querySelectorAll('.icon_col.folder').forEach((folder) => {
                                folder.classList.remove('open');
                            });
                        content.classList.remove('open');

                        const prevParentElement = content.dataset.parent;

                        document.querySelector(prevParentElement).lastElementChild.after(content);

                        content = element.lastElementChild;

                        insertContent(content, element, function() {
                            content.classList.toggle('open')
                            element.classList.toggle('open');
                            content.scrollIntoView({
                                behavior: 'smooth',
                                block: "center",
                                inline: "center"
                            });
                        });
                    }

                } else {
                    document.querySelectorAll('.my_row.folder').
                        forEach((element) => {
                            element.classList.remove('open');
                        })
                    content = element.lastElementChild;

                    insertContent(content, element, function() {
                        content.classList.toggle('open')
                        element.classList.toggle('open');
                        content.scrollIntoView({
                            behavior: 'smooth',
                            block: "center",
                            inline: "center"
                        });
                    });
                }
            })
        });
    }

    const linkTrackers = document.querySelectorAll('.link_tracker');

    if (linkTrackers.length > 0) {

        linkTrackers.forEach((link) => {
            link.addEventListener('click', function(e) {
                const linkID = this.dataset.id;

                axios.post('/link-click/' + linkID, ).then(
                    (response) => {
                        console.log(JSON.stringify(response.data.message));
                    },

                ).catch(error => {
                    if (error.response) {
                        console.log(error.response);
                    } else {
                        console.log("ERROR:: ", error);
                    }
                });
            })
        })
    }

});
