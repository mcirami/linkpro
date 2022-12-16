export const PreviewHeight = () => {
    const windowWidth = window.outerWidth;

    const box = document.querySelector('.inner_content_wrap');
    const innerContent = document.getElementById('preview_wrap');

    let pixelsToMinus;
    if (windowWidth > 551) {
        pixelsToMinus = 35;
    } else {
        pixelsToMinus = 25;
    }

    box.style.maxHeight = innerContent.offsetHeight - pixelsToMinus + "px";
}
