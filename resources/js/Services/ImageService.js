import {toLower} from 'lodash';

const socialArray = [
    "facebook",
    "instagram",
    "twitter",
    "tiktok",
    "snapchat",
    "youtube",
    "onlyfans",
    "email",
    "google mail",
    "phone",
    "slack",
    "telegram",
    "skype"
]

export const completedImageCrop = (completedCrop, imgRef, previewCanvasRef) => {

    const image = imgRef.current;
    const canvas = previewCanvasRef;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );
}

export const createImage = (file, setUpImg, setPageSettings = null, pageSettings = null) => {
    let reader = new FileReader();
    reader.onload = (e) => {
        if (setPageSettings && pageSettings) {
            setPageSettings({
                ...pageSettings,
                header_img: e.target.result,
            });
        }
        setUpImg(e.target.result);
    };
    reader.readAsDataURL(file);
};

export const getIconPaths = (iconPaths) => {

    let iconArray = [];

    iconPaths.map((iconPath) => {
        const end = iconPath.lastIndexOf("/");
        const newPath = iconPath.slice(end);
        const newArray = newPath.split(".")
        const iconName = newArray[0].replace("/", "");
        const tmp = {"name": iconName.replace("-", " "), "path" : iconPath}
        iconArray.push(tmp);
    });

    let count = 0;
    socialArray.map((name, index) => {
        const iconIndex = iconArray.findIndex(object => {
            return toLower(object.name) === name
        })

        move(iconArray, iconIndex, count);
        ++count;
    })

    return iconArray;
}

function move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        let k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}
