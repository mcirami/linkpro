export const PreviewHeight = () => {
    const windowWidth = window.outerWidth;

    const box = document.querySelector('.inner_content_wrap');
    const innerContent = document.getElementById('preview_wrap');

    console.log("box: ", box);
    console.log("innerContent: ", innerContent)

    let pixelsToMinus;
    if (windowWidth > 551) {
        pixelsToMinus = 30;
    } else {
        pixelsToMinus = 20;
    }

    console.log(innerContent.offsetHeight);

    box.style.maxHeight = innerContent.offsetHeight - pixelsToMinus + "px";
}
