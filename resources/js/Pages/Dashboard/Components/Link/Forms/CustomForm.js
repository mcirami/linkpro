import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import IconList from '../IconList';
import InputTypeRadio from './InputTypeRadio';
import InputComponent from './InputComponent';
import {completedImageCrop} from '../../../../../Services/ImageService';
import {
    FolderLinksContext,
    PageContext,
    UserLinksContext,
} from '../../../App';
import {
    addLink,
    checkURL,
    updateLink,
    updateLinkStatus,
} from '../../../../../Services/LinksRequest';
import {
    FOLDER_LINKS_ACTIONS,
    LINKS_ACTIONS,
} from '../../../../../Services/Reducer';
import EventBus from '../../../../../Utils/Bus';
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    convertToPixelCrop,
} from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import { useDebounceEffect } from '../../../../../Utils/useDebounceEffect';
import { canvasPreview } from '../../../../../Utils/canvasPreview';
import {HandleFocus, HandleBlur} from '../../../../../Utils/InputAnimations';
import {HiMinus, HiPlus} from 'react-icons/hi';

function centerAspectCrop(
    mediaWidth,
    mediaHeight,
    aspect,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

const CustomForm = ({
                        accordionValue,
                        setAccordionValue,
                        inputType,
                        setInputType,
                        editID,
                        setShowLinkForm,
                        setEditID,
                        folderID,
                        setShowLoader,
}) => {

    const [customIconArray, setCustomIconArray] = useState([]);
    const { userLinks, dispatch } = useContext(UserLinksContext);
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    const  { pageSettings } = useContext(PageContext);

    //const iconRef = useRef(null)
    const [completedIconCrop, setCompletedIconCrop] = useState({});
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(1)

    // if a custom icon is selected
    const [iconSelected, setIconSelected] = useState(false);

    //image cropping
    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30 });
    const [customIcon, setCustomIcon] = useState(null);

    const [charactersLeft, setCharactersLeft] = useState();

    const [currentLink, setCurrentLink] = useState (
        userLinks.find(function(e) {
            return e.id === editID
        }) || folderLinks.find(function(e) {
            return e.id === editID
        }) ||
        {
            icon: null,
            name: null,
            url: null,
            email: null,
            phone: null,
            mailchimp_list_id: null,
            shopify_products: null,
            shopify_id: null,
            type: null,
        }
    );

    useDebounceEffect(
        async () => {
            if (
                completedIconCrop?.width &&
                completedIconCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedIconCrop,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedIconCrop, scale, rotate],
    )

    useEffect(() => {
        if(currentLink.name) {
            setCharactersLeft(11 - currentLink.name.length);
        } else {
            setCharactersLeft(11);
        }

    },[charactersLeft])

    useEffect(() => {
        if (!customIcon) {
            return
        }
        const objectUrl = URL.createObjectURL(customIcon)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [customIcon]);

   /* useEffect(() => {
        if (!completedIconCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        completedImageCrop(completedIconCrop, imgRef, previewCanvasRef.current);

    }, [completedIconCrop]);*/

    const selectCustomIcon = e => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        setIconSelected(true);

        createImage(files[0]);
    }

    const createImage = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            setUpImg(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    function onLoad(e) {
        if (aspect) {
            const {width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (iconSelected) {
            previewCanvasRef.current.toBlob(
                (blob) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob)
                    reader.onloadend = () => {
                        dataURLtoFile(reader.result, 'cropped.jpg');
                    }
                },
                'image/png',
                1
            );
        } else {
            let URL = currentLink.url;
            let data;

            if (URL && currentLink.name) {
                data = checkURL(URL, currentLink.name, false,
                    true);
            } else {
                data = {
                    success: true,
                    url: URL
                }
            }

            if (data["success"]) {

                URL = data["url"];
                let packets;

                switch (inputType) {
                    case "url":
                        packets = {
                            name: currentLink.name,
                            url: URL,
                            icon: currentLink.icon,
                            page_id: pageSettings["id"],
                            folder_id: folderID,
                            type: currentLink.type,
                        };
                        break;
                    case "email":
                        packets = {
                            name: currentLink.name,
                            email: currentLink.email,
                            icon: currentLink.icon,
                            page_id: pageSettings["id"],
                            folder_id: folderID,
                            type: currentLink.type,
                        };
                        break;
                    case "phone":
                        packets = {
                            name: currentLink.name,
                            phone: currentLink.phone,
                            icon: currentLink.icon,
                            page_id: pageSettings["id"],
                            folder_id: folderID,
                            type: currentLink.type,
                        };
                        break;
                    default:
                        break;
                }

                const func = editID ? updateLink(packets, editID) : addLink(packets);

                func.then((data) => {

                    if (data.success) {

                        if (folderID) {

                            if (editID) {
                                dispatchFolderLinks({
                                    type: FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS,
                                    payload: {
                                        editID: editID,
                                        currentLink: currentLink,
                                        url: URL,
                                        iconPath: currentLink.icon
                                    }
                                })

                                dispatch({
                                    type: LINKS_ACTIONS.UPDATE_LINK_IN_FOLDER,
                                    payload: {
                                        folderID: folderID,
                                        editID: editID,
                                        currentLink: currentLink,
                                        url: URL,
                                        iconPath: currentLink.icon
                                    }
                                })

                            } else {
                                let newFolderLinks = [...folderLinks];

                                const newLinkObject = {
                                    id: data.link_id,
                                    folder_id: folderID,
                                    name: currentLink.name,
                                    url: URL,
                                    email: currentLink.email,
                                    phone: currentLink.phone,
                                    type: currentLink.type,
                                    mailchimp_list_id: currentLink.mailchimp_list_id,
                                    shopify_products: currentLink.shopify_products,
                                    shopify_id: currentLink.shopify_id,
                                    icon: currentLink.icon,
                                    position: data.position,
                                    active_status: true
                                }

                                newFolderLinks = newFolderLinks.concat(
                                    newLinkObject);

                                dispatchFolderLinks({
                                    type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS,
                                    payload: {
                                        links: newFolderLinks
                                    }
                                });

                                let folderActive = null;
                                if (newFolderLinks.length === 1) {
                                    folderActive = true;
                                    const url = "/dashboard/folder/status/";
                                    const packets = {
                                        active_status: folderActive,
                                    };

                                    updateLinkStatus(packets, folderID,
                                        url);
                                }

                                dispatch({
                                    type: LINKS_ACTIONS.ADD_NEW_IN_FOLDER,
                                    payload: {
                                        newLinkObject: newLinkObject,
                                        folderActive: folderActive,
                                        folderID: folderID
                                    }
                                })
                            }

                        } else {

                            if (editID) {
                                dispatch({
                                    type: LINKS_ACTIONS.UPDATE_LINK,
                                    payload: {
                                        editID: editID,
                                        currentLink: currentLink,
                                        url: URL,
                                        iconPath: currentLink.icon
                                    }
                                })

                            } else {
                                let newLinks = [...userLinks];

                                const newLinkObject = {
                                    id: data.link_id,
                                    name: currentLink.name,
                                    url: URL,
                                    email: currentLink.email,
                                    phone: currentLink.phone,
                                    type: currentLink.type,
                                    mailchimp_list_id: currentLink.mailchimp_list_id,
                                    shopify_products: currentLink.shopify_products,
                                    shopify_id: currentLink.shopify_id,
                                    icon: currentLink.icon,
                                    position: data.position,
                                    active_status: true
                                }

                                dispatch({
                                    type: LINKS_ACTIONS.SET_LINKS,
                                    payload: {
                                        links: newLinks.concat(
                                            newLinkObject)
                                    }
                                })
                            }

                        }

                        setShowLinkForm(false);
                        setEditID(null);
                        setCurrentLink({
                            icon: null,
                            name: null,
                            url: null,
                            email: null,
                            phone: null,
                            mailchimp_list_id: null,
                            shopify_products: null,
                            shopify_id: null,
                            type: null
                        })
                    }
                })
            }
        }
    }

    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        let croppedImage = new File([u8arr], filename, {type:mime});
        submitWithCustomIcon(croppedImage);
    }

    const submitWithCustomIcon = (image) => {

        if(currentLink.name &&
            (
                currentLink.url ||
                currentLink.email ||
                currentLink.phone
            )
        ) {

            setShowLoader({show: true, icon: "upload", position: "fixed"})
            window.Vapor.store(
                image,
                {
                    visibility: "public-read"
                },
                {
                    progress: progress => {
                        this.uploadProgress = Math.round(progress * 100);
                    }
                }
            ).then(response => {

                let URL = currentLink.url;
                if (URL) {
                    URL = checkURL(currentLink.url, null, true);
                }

                let packets;

                switch (inputType) {
                    case "url":
                        packets = {
                            name: currentLink.name,
                            url: URL,
                            icon: response.key,
                            page_id: pageSettings["id"],
                            ext: response.extension,
                            folder_id: folderID,
                            type: currentLink.type,
                        };
                        break;
                    case "email":
                        packets = {
                            name: currentLink.name,
                            email: currentLink.email,
                            icon: response.key,
                            page_id: pageSettings["id"],
                            ext: response.extension,
                            folder_id: folderID,
                            type: currentLink.type,
                        };
                        break;
                    case "phone":
                        packets = {
                            name: currentLink.name,
                            phone: currentLink.phone,
                            icon: response.key,
                            page_id: pageSettings["id"],
                            ext: response.extension,
                            folder_id: folderID,
                            type: currentLink.type,
                        };
                        break;
                    default:
                        break;
                }

                const func = editID ? updateLink(packets, editID) : addLink(packets);

                func.then((data) => {
                    setShowLoader({show: false, icon: null});

                    if (data.success) {

                        if (folderID) {

                            if (editID) {
                                dispatchFolderLinks({
                                    type: FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS,
                                    payload: {
                                        editID: editID,
                                        currentLink: currentLink,
                                        url: URL,
                                        iconPath: data.iconPath
                                    }})

                                dispatch({
                                    type: LINKS_ACTIONS.UPDATE_LINK_IN_FOLDER,
                                    payload: {
                                        folderID: folderID,
                                        editID: editID,
                                        currentLink: currentLink,
                                        url: URL,
                                        iconPath: data.iconPath
                                    }})

                            } else {
                                let newFolderLinks = [...folderLinks];

                                const newLinkObject = {
                                    id: data.link_id,
                                    folder_id: folderID,
                                    name: currentLink.name,
                                    url: URL,
                                    email: currentLink.email,
                                    phone: currentLink.phone,
                                    mailchimp_list_id: currentLink.mailchimp_list_id,
                                    shopify_products: currentLink.shopify_products,
                                    shopify_id: currentLink.shopify_id,
                                    type: currentLink.type,
                                    icon: data.icon_path,
                                    position: data.position,
                                    active_status: true
                                }

                                let folderActive = null;
                                if (newFolderLinks.length === 1) {
                                    folderActive = true;
                                    const url = "/dashboard/folder/status/";
                                    const packets = {
                                        active_status: folderActive,
                                    };

                                    updateLinkStatus(packets, folderID, url);
                                }

                                dispatch({
                                    type: LINKS_ACTIONS.ADD_NEW_IN_FOLDER,
                                    payload: {
                                        newLinkObject: newLinkObject,
                                        folderActive: folderActive,
                                        folderID: folderID
                                    }})

                                dispatchFolderLinks({
                                    type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS,
                                    payload: {
                                        links: newFolderLinks.concat(newLinkObject)
                                    }});
                            }

                        } else {

                            if (editID) {
                                dispatch({
                                    type: LINKS_ACTIONS.UPDATE_LINK,
                                    payload: {
                                        editID: editID,
                                        currentLink: currentLink,
                                        url: URL,
                                        iconPath: data.iconPath
                                    }})

                            } else {
                                let newLinks = [...userLinks];

                                const newLinkObject = {
                                    id: data.link_id,
                                    name: currentLink.name,
                                    url: URL,
                                    email: currentLink.email,
                                    phone: currentLink.phone,
                                    type: currentLink.type,
                                    icon: data.icon_path,
                                    position: data.position,
                                    active_status: true
                                }

                                dispatch({
                                    type: LINKS_ACTIONS.SET_LINKS,
                                    payload: {
                                        links: newLinks.concat(newLinkObject)
                                    }})
                            }

                        }

                        setCustomIconArray(customIconArray => [
                            ...customIconArray,
                            data.icon_path
                        ]);

                        setShowLinkForm(false);
                        setAccordionValue(null);
                        setEditID(null)
                        setInputType(null);
                        setCurrentLink({
                            icon: null,
                            name: null,
                            url: null,
                            email: null,
                            phone: null,
                            mailchimp_list_id: null,
                            shopify_products: null,
                            type: null
                        })
                    }
                })

            }).catch(error => {
                console.error(error);
            });
        } else {
            EventBus.dispatch("error", { message: "Icon Destination and Name is Required" });
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setEditID(null);
        setShowLinkForm(false);
        setAccordionValue(null);
        setInputType(null);
        document.getElementById('left_col_wrap').style.minHeight = "unset";
    }

    const handleLinkName = useCallback( (e) => {
        let value = e.target.value;

        setCharactersLeft(11 - value.length);

        setCurrentLink(() => ({
            ...currentLink,
            name: value
        }))
    });

    const handleIncreaseNumber = (e,type) => {
        e.preventDefault();
        if (type === "scale") {

            const number = scale + .1;
            const result = Math.round(number * 10) / 10;
            setScale(result);
        }

        if (type === "rotate") {
            setRotate(Math.min(180, Math.max(-180, Number(rotate + 1))))
        }
    }

    const handleDecreaseNumber = (e, type) => {
        e.preventDefault();
        if (type === "scale") {
            const number = scale - .1;
            const result = Math.round(number * 10) / 10;
            setScale(result);
        }

        if (type === "rotate") {
            setRotate(Math.min(180, Math.max(-180, Number(rotate - 1))))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="link_form">
            <div className="row">
                <div className="col-12">
                    {iconSelected &&
                        <div className="crop_section">
                            <p>Crop Icon</p>

                            <div className="crop_tools">
                                <div className="column">
                                    <a href="#" className="number_control" onClick={(e) => handleDecreaseNumber(e, "scale")}>
                                        <HiMinus />
                                    </a>
                                    <div className="position-relative">
                                        <input
                                            className="active animate"
                                            id="scale-input"
                                            type="text"
                                            step="0.1"
                                            value={scale}
                                            onChange={(e) => setScale(Number(e.target.value))}
                                        />
                                        <label htmlFor="scale-input">Scale</label>
                                    </div>
                                    <a href="#" className="number_control" onClick={(e) => handleIncreaseNumber(e, "scale")}>
                                        <HiPlus />
                                    </a>
                                </div>
                                <div className="column">
                                    <a href="#" className="number_control" onClick={(e) => handleDecreaseNumber(e, "rotate")}>
                                        <HiMinus />
                                    </a>
                                    <div className="position-relative">
                                        <input
                                            className="active animate"
                                            id="rotate-input"
                                            type="text"
                                            value={rotate}
                                            onChange={(e) =>
                                                setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
                                            }
                                        />
                                        <label htmlFor="rotate-input">Rotate</label>
                                    </div>
                                    <a href="#" className="number_control" onClick={(e) => handleIncreaseNumber(e, "rotate")}>
                                        <HiPlus />
                                    </a>
                                </div>
                            </div>
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedIconCrop(c)}
                                aspect={aspect}
                            >
                                <img
                                    onLoad={onLoad}
                                    src={upImg}
                                    ref={imgRef}
                                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                    alt="Crop Me"/>
                            </ReactCrop>
                            <div className="icon_col">
                                <p>Icon Preview</p>
                                <canvas
                                    ref={previewCanvasRef}
                                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                    style={{
                                        backgroundSize: `cover`,
                                        backgroundRepeat: `no-repeat`,
                                        width: iconSelected ? `100%` : 0,
                                        height: iconSelected ? `100%` : 0,
                                        borderRadius: `20px`,
                                    }}
                                />
                            </div>
                        </div>
                    }
                    <div className="icon_row">
                        <div className="icon_box">
                            <div className="uploader">
                                <label htmlFor="custom_icon_upload" className="custom text-uppercase button blue">
                                    Upload Image
                                </label>
                                <input id="custom_icon_upload" type="file" className="custom" onChange={selectCustomIcon} accept="image/png, image/jpeg, image/jpg, image/gif"/>
                                <div className="my_row info_text file_types text-center mb-2">
                                    <p className="m-0 char_count w-100 ">Allowed File Types: <span>png, jpg, jpeg, gif</span>
                                    </p>
                                </div>
                            </div>
                            <IconList
                                currentLink={currentLink}
                                setCurrentLink={setCurrentLink}
                                accordionValue={accordionValue}
                                setCharactersLeft={setCharactersLeft}
                                inputType={inputType}
                                setInputType={setInputType}
                                customIconArray={customIconArray}
                                setCustomIconArray={setCustomIconArray}
                                editID={editID}
                            />

                        </div>
                    </div>

                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="input_wrap">
                        <input
                            className={currentLink.name !== "" ? "active" : ""}
                            name="name"
                            type="text"
                            value={currentLink.name ||
                                ""}
                            onChange={(e) => handleLinkName(e)}
                            onFocus={(e) => HandleFocus(e.target)}
                            onBlur={(e) => HandleBlur(e.target)}
                        />
                        <label>Link Name</label>
                    </div>
                    <div className="my_row info_text title">
                        <p className="char_max">Max 11 Characters Shown</p>
                        <p className="char_count">
                            {charactersLeft < 0 ?
                                <span className="over">Only 11 Characters Will Be Shown</span>
                                :
                                "Characters Left: " +
                                charactersLeft
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="row mb-0">
                <div className="col-12">
                    <InputTypeRadio
                        inputType={inputType}
                        setInputType={setInputType}
                        currentLink={currentLink}
                        setCurrentLink={setCurrentLink}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <InputComponent
                        inputType={inputType}
                        setInputType={setInputType}
                        currentLink={currentLink}
                        setCurrentLink={setCurrentLink}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-12 button_row">
                    <button className="button green" type="submit">
                        Save
                    </button>
                    <a href="#" className="button transparent gray" onClick={(e) => handleCancel(e)}>
                        Cancel
                    </a>
                    <a className="help_link" href="mailto:help@link.pro">Need Help?</a>
                </div>
            </div>

        </form>
    );
};

export default CustomForm;
