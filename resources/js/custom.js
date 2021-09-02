'use strict'
jQuery(document).ready(function($) {

    let windowWidth = $(window).width();
    const box = document.querySelector('.links_wrap.preview');
    const innerContent = document.getElementById('preview_wrap');
    const iconsWrap = document.querySelector('.icons_wrap');
    const iconCol = document.querySelectorAll('.icon_col:last-child');
    iconsWrap.style.minHeight = getDivHeight() + "px";

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

            iconsWrap.style.minHeight = getDivHeight() + "px";
        });
    }

    function getDivHeight() {
        const transformProp = iconCol[0].style.transform.split("translate3d(");
        const transformValues = transformProp[1].split(" ");
        const divHeight = transformValues[1].replace(",", "").replace("px", "");
        return parseInt(divHeight) + 250 + 20;
    }
});
