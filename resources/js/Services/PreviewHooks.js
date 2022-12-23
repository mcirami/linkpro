export const PreviewHeight = () => {
    const windowWidth = window.outerWidth;

    const innerContent = document.getElementById('preview_wrap');
    const box = document.querySelector('.inner_content_wrap');

    console.log("window width: ", windowWidth);
    let pixelsToMinus;
    if (windowWidth > 551) {
        pixelsToMinus = 30;
    } else {
        pixelsToMinus = 20;
    }

    console.log((windowWidth - 160) / 2);

    box.style.maxHeight = innerContent.offsetHeight - pixelsToMinus + "px";
}
