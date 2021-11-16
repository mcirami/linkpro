import React, {
    createRef,
    useCallback,
    useContext, useEffect,
    useRef,
    useState,
} from 'react';
import IconList from "./IconList";
import {MdDeleteForever} from 'react-icons/md';
import { UserLinksContext, OriginalArrayContext, PageContext } from '../App';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import InputComponent from './InputComponent';
const iconPaths = user.icons;
import {updateLink} from '../../Services/LinksRequest';

const SubmitForm = ({
        editID,
        setEditID,
        setShowUpgradePopup,
        setShowConfirmPopup,
        setOptionText,
        userSub,
        customIconArray,
        setCustomIconArray
}) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const { originalArray, setOriginalArray } = useContext(OriginalArrayContext);
    const  { pageSettings, setPageSettings } = useContext(PageContext);


    const iconRef = createRef(null)
    const [completedIconCrop, setCompletedIconCrop] = useState(null);
    const [iconSelected, setIconSelected] = useState(false);

    //image cropping
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = iconRef;
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });
    const [customIcon, setCustomIcon] = useState(null);

    const [radioValue, setRadioValue] = useState("standard");
    const [subStatus, setSubStatus] = useState(false);

    const [ currentLink, setCurrentLink ] = useState(
        userLinks.find(function(e) {
            return e.id === editID
        }) || null );

    const [inputType, setInputType] = useState(
        currentLink.email && "email" || currentLink.url && "url" || currentLink.phone && "phone"
    );

    useEffect (() => {
        if (!userSub || userSub["ends_at"] && new Date(userSub["ends_at"]).valueOf() < new Date().valueOf()) {
            setSubStatus(true);
        }

    }, [setSubStatus]);

    let iconArray = [];

    iconPaths.map((iconPath) => {
        const end = iconPath.lastIndexOf("/");
        const newPath = iconPath.slice(end);
        const newArray = newPath.split(".")
        const iconName = newArray[0].replace("/", "");
        const tmp = {"name": iconName.replace("-", " "), "path" : iconPath}
        iconArray.push(tmp);
    });

    const [charactersLeft, setCharactersLeft] = useState();

    useEffect(() => {
        if(currentLink.name) {
            setCharactersLeft(13 - currentLink.name.length);
        } else {
            setCharactersLeft(13);
        }
    },[charactersLeft])

    const [input, setInput] = useState("");
    const handleChange = (e) => {
        e.preventDefault();
        setInput(e.target.value);
    }
    if (input.length > 0 ) {
        iconArray = iconArray.filter((i) => {
            const iconName = i.name.toLowerCase().replace(" ", "");
            const userInput = input.toLowerCase().replace(" ", "");
            return iconName.match(userInput);
        });
    }

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

    const onLoad = useCallback((img) => {
        imgRef.current = img;
        const linkFormHeight = document.getElementsByClassName('link_form')[0].offsetHeight;
        document.getElementById('left_col_wrap').style.minHeight = linkFormHeight + 160 + "px";
    }, []);


    useEffect(() => {
        if (!customIcon) {
            return
        }
        const objectUrl = URL.createObjectURL(customIcon)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [customIcon]);

    useEffect(() => {
        if (!completedIconCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedIconCrop;

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
    }, [completedIconCrop]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (iconSelected) {

            previewCanvasRef.current.toBlob(
                (blob) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob)
                    reader.onloadend = () => {
                        submitWithCustomIcon(reader.result);
                    }
                },
                'image/png',
                1
            );

        } else {

            const packets = {
                name: currentLink.name,
                url: currentLink.url,
                email: currentLink.email,
                phone: currentLink.phone,
                icon: currentLink.icon,
                page_id: pageSettings["id"],
            };

            updateLink(packets, editID)
            .then((data) => {

                if (data.success) {
                    setUserLinks(
                        userLinks.map((item) => {
                            if (item.id === editID) {
                                return {
                                    ...item,
                                    name: currentLink.name,
                                    url: currentLink.url,
                                    email: currentLink.email,
                                    phone: currentLink.phone,
                                    icon: currentLink.icon
                                }
                            }
                            return item;
                        })
                    )
                    setOriginalArray(
                        originalArray.map((item) => {
                            if (item.id === editID) {
                                return {
                                    ...item,
                                    name: currentLink.name,
                                    url: currentLink.url,
                                    email: currentLink.email,
                                    phone: currentLink.phone,
                                    icon: currentLink.icon
                                }
                            }
                            return item;
                        })
                    )
                    setEditID(null)
                }
            })
        }

    };

    const submitWithCustomIcon = (image) => {

        const packets = {
            name: currentLink.name || null,
            url: currentLink.url || null,
            email: currentLink.email || null,
            phone: currentLink.phone || null,
            icon: image || null,
            page_id: pageSettings["id"],
        };

        updateLink(packets, editID)
        .then((data) => {

            if (data.success) {
                setUserLinks(
                    userLinks.map((item) => {
                        if (item.id === editID) {
                            return {
                                ...item,
                                name: currentLink.name,
                                url: currentLink.url,
                                email: currentLink.email,
                                phone: currentLink.phone,
                                icon: image
                            }
                        }
                        return item;
                    })
                )
                setOriginalArray(
                    originalArray.map((item) => {
                        if (item.id === editID) {
                            return {
                                ...item,
                                name: currentLink.name,
                                url: currentLink.url,
                                email: currentLink.email,
                                phone: currentLink.phone,
                                icon: image
                            }
                        }
                        return item;
                    })
                )

                const newIconPath = "public" + data.iconPath;
                setCustomIconArray( customIconArray => [
                    ...customIconArray,
                    newIconPath
                ]);

                setEditID(null)
            }
        })
    }

    const handleOnClick = e => {
        if (subStatus) {

            let text;
            if (e.target.dataset.type === "custom" ) {
                text = "add custom icons"
            } else {
                text = "change link name"
            }

            const popup = document.querySelector('#upgrade_popup');
            setShowUpgradePopup(true);
            popup.classList.add('open');
            setOptionText(text);

            setTimeout(() => {
                document.querySelector('#upgrade_popup .close_popup').
                    addEventListener('click', function(e) {
                        e.preventDefault();
                        setShowUpgradePopup(false);
                        popup.classList.remove('open');
                    });
            }, 500);
        }
    }

    const handleLinkName = (e) => {
        const value = e.target.value;

        setCharactersLeft(13 - value.length);

        setCurrentLink({
            ...currentLink,
            name: value
        })
    }

    const handleDeleteClick = e => {
        e.preventDefault();
        setShowConfirmPopup(true);
        document.querySelector('#confirm_popup_link').classList.add('open');
    }

    return (
        <div className="edit_form popup" key={editID}>
            <form onSubmit={handleSubmit} className="link_form">
                <div className="row">
                    <div className="col-12">
                        {userLinks.length > 1 ?
                            <a className="delete" href="#" onClick={handleDeleteClick}><MdDeleteForever /></a>
                            :
                            ""
                        }
                        {radioValue === "custom" ?
                            <div className={!iconSelected ?
                                "crop_section hidden" :
                                "crop_section"}>
                                {iconSelected ? <p>Crop Icon</p> : ""}
                                <ReactCrop
                                    src={upImg}
                                    onImageLoaded={onLoad}
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedIconCrop(c)}
                                />
                                <div className="icon_col">
                                    {iconSelected ? <p>Icon Preview</p> : ""}
                                    <canvas
                                        ref={iconRef}
                                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                        style={{
                                            backgroundImage: iconRef,
                                            backgroundSize: `cover`,
                                            backgroundRepeat: `no-repeat`,
                                            width: completedIconCrop ?
                                                `100%` :
                                                0,
                                            height: completedIconCrop ?
                                                `100%` :
                                                0,
                                            borderRadius: `20px`,
                                        }}
                                    />
                                </div>
                            </div>
                            :
                            ""
                        }
                        <div className="icon_row">
                            <div className="icon_box">
                                <div className="my_row top">
                                    <div className={radioValue === "standard" ? "radio_wrap active" : "radio_wrap" }>
                                        <input type="radio" value="standard" name="icon_type" defaultChecked onChange={(e) => {setRadioValue(e.target.value) }}/>
                                        <label htmlFor="icon_type">Standard Icons</label>
                                    </div>
                                    <div className={radioValue === "custom" ? "radio_wrap active" : "radio_wrap" }>
                                        <input type="radio" value="custom" name="icon_type"
                                               onChange={(e) => {setRadioValue(e.target.value) }}
                                               disabled={subStatus}
                                        />
                                        <label htmlFor="icon_type">Custom Icons</label>
                                        {subStatus && <span className="disabled_wrap" data-type="custom" onClick={(e) => handleOnClick(e)} />}
                                    </div>
                                </div>

                                {radioValue === "custom" ?
                                    <div className="uploader">
                                        <label htmlFor="custom_icon_upload" className="custom text-uppercase button blue">
                                            Upload Image
                                        </label>
                                        <input id="custom_icon_upload" type="file" className="custom" onChange={selectCustomIcon}/>
                                    </div>
                                    :
                                    <div className="uploader">
                                        <input name="search" type="text" placeholder="Search Icons" onChange={handleChange} />
                                    </div>
                                }

                                <IconList
                                    currentLink={currentLink}
                                    setCurrentLink={setCurrentLink}
                                    iconArray={iconArray}
                                    radioValue={radioValue}
                                    setCharactersLeft={setCharactersLeft}
                                    customIconArray={customIconArray}
                                    setInputType={setInputType}
                                />

                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="input_wrap">
                            <input
                                maxLength="13"
                                name="name"
                                type="text"
                                value={currentLink.name || ""}
                                placeholder="Link Name"
                                onChange={(e) => handleLinkName(e)}
                                disabled={subStatus}
                                className={subStatus ? "disabled" : ""}
                            />
                            {subStatus && <span className="disabled_wrap" data-type="name" onClick={(e) => handleOnClick(e)}> </span>}
                        </div>
                        <div className="my_row characters title">
                            <p className="char_max">Max 13 Characters</p>
                            <p className="char_count">
                                {charactersLeft < 0 ?
                                    <span className="over">Over Character Limit</span>
                                    :
                                    "Characters Left: " + charactersLeft
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <InputComponent
                            inputType={inputType}
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
                        <a href="#" className="button transparent gray" onClick={(e) => {
                            e.preventDefault();
                            setEditID(null);
                            document.getElementById('left_col_wrap').style.minHeight = "unset";
                        }}>
                            Cancel
                        </a>
                        <a className="help_link" href="mailto:help@link.pro">Need Help?</a>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SubmitForm;
