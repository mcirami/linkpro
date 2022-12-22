export const PreviewHeight = () => {
    const windowWidth = window.outerWidth;

    const box = document.querySelector('.inner_content_wrap');
    const innerContent = document.getElementById('preview_wrap');

    let pixelsToMinus;
    if (windowWidth > 551) {
        pixelsToMinus = 30;
    } else {
        pixelsToMinus = 20;
    }

    box.style.maxHeight = innerContent.offsetHeight - pixelsToMinus + "px";
}
