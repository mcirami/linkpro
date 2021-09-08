'use strict'
jQuery(document).ready(function($) {

    let windowWidth = $(window).width();
    const box = document.querySelector('.links_wrap.preview');
    const innerContent = document.getElementById('preview_wrap');
    const iconsWrap = document.querySelector('.icons_wrap');
    const iconCol = document.querySelectorAll('.add_icons .icon_col:last-child');
    //iconsWrap.style.minHeight = getDivHeight(iconCol) + "px";


    if (box) {

        if (windowWidth < 1200) {
            //const height = box.offsetHeight;
            const width = box.offsetWidth;
            innerContent.style.maxHeight = width * 2 + "px";
        }

        $(window).on('resize', function() {

            windowWidth = $(window).width();
           /* const iconCol = document.querySelectorAll('.add_icons .icon_col:last-child');
            iconsWrap.style.minHeight = getDivHeight(iconCol) + "px";*/

            if (windowWidth < 1200) {
                //const height = box.offsetHeight;
                const width = box.offsetWidth;
                innerContent.style.maxHeight = width * 2 + "px";
            } else {
                innerContent.style.maxHeight = "860px";
            }

        });
    }

    function getDivHeight(iconColValue) {
        const colHeight = iconColValue[0].offsetHeight;
        console.log("col height: " + colHeight);
        console.log("lenght: " + iconColValue.length);
        const count = Math.ceil(iconColValue.length / 3);
        const transformProp = iconColValue[iconColValue.length - 1].style.transform.split("translate3d(");
        const transformValues = transformProp[1].split(" ");
        const divHeight = transformValues[1].replace(",", "").replace("px", "");
        console.log("div height: " + divHeight);
        //return parseInt(colHeight) * count - 150;
        return parseInt(divHeight) + colHeight;
    }
});
