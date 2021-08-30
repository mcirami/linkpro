'use strict'
jQuery(document).ready(function($) {

    let windowWidth = $(window).width();
    const box = document.querySelector('.links_wrap.preview');
    const innerContent = document.getElementById('preview_wrap');

    if (box) {

        if (windowWidth < 1200) {
            //const height = box.offsetHeight;
            const width = box.offsetWidth;
            innerContent.style.maxHeight = width * 2 + "px";
        }

        $(window).on('resize', function() {

            windowWidth = $(window).width();

            if (windowWidth < 1200) {
                //const height = box.offsetHeight;
                const width = box.offsetWidth;
                innerContent.style.maxHeight = width * 2 + "px";
            } else {
                innerContent.style.maxHeight = "860px";
            }


        });
    }


});
