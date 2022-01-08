import React, {
    createRef,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import IconList from "./IconList";
import { UserLinksContext, OriginalArrayContext, PageContext } from '../App';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import InputComponent from './InputComponent';
const iconPaths = user.icons;
import {addLink, checkURL, updateContentHeight} from '../../../../Services/LinksRequest';
import EventBus from '../../../../Utils/Bus';
import { BiChevronLeft, BiChevronsLeft,  } from "react-icons/bi";

const NewForm = ({
                     setShowNewForm,
                     customIconArray,
                     setCustomIconArray,
                     setShowLoader,
                     setShowUpgradePopup,
                     setOptionText,
                     userSub,
                     folderID,
                     setEditFolderID,
                     folderLinks,
                     setFolderLinks,
                     originalFolderLinks,
                     setOriginalFolderLinks
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

    const [inputType, setInputType] = useState("url");

    const [currentLink, setCurrentLink] = useState (() => ({
        icon: null,
        name: null,
        url: null,
        email: null,
        phone: null
    }))

    /*const [ currentLink, setCurrentLink ] = useState(
        userLinks.find(function(e) {
            return e.id === editID
        }) || null );

    const [inputType, setInputType] = useState(
        currentLink.email && "email" || currentLink.url && "url" || currentLink.phone && "phone"
    );*/

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
            setCharactersLeft(11 - currentLink.name.length);
        } else {
            setCharactersLeft(11);
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
                data = checkURL(URL, currentLink.name, null, subStatus);
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
                            folder_id: folderID
                        };
                        break;
                    case "email":
                        packets = {
                            name: currentLink.name,
                            email: currentLink.email,
                            icon: currentLink.icon,
                            page_id: pageSettings["id"],
                            folder_id: folderID
                        };
                        break;
                    case "phone":
                        packets = {
                            name: currentLink.name,
                            phone: currentLink.phone,
                            icon: currentLink.icon,
                            page_id: pageSettings["id"],
                            folder_id: folderID
                        };
                        break;
                }

                addLink(packets)
                .then((data) => {


                    if (data.success) {

                        if(folderID) {
                            let newFolderLinks = [...folderLinks];
                            let newOriginalFolderLinks = [...originalFolderLinks];

                            const newLinkObject = {
                                id: data.link_id,
                                folder_id: folderID,
                                name: currentLink.name,
                                url: URL,
                                email: currentLink.email,
                                phone: currentLink.phone,
                                icon: currentLink.icon,
                                position: data.position,
                                active_status: true
                            }

                            setUserLinks (
                                userLinks.map((item) => {
                                    if (item.id === folderID) {
                                        const itemLinks = item.links.concat(newLinkObject)

                                        return {
                                            ...item,
                                            links: itemLinks
                                        }
                                    }

                                    return item;

                                })
                            )

                            setOriginalArray (
                                originalArray.map((item) => {
                                    if (item.id === folderID) {
                                        const itemLinks = item.links.concat(newLinkObject)

                                        return {
                                            ...item,
                                            links: itemLinks
                                        }
                                    }

                                    return item;

                                })
                            )

                            setOriginalFolderLinks(newOriginalFolderLinks.concat(newLinkObject));
                            setFolderLinks(newFolderLinks.concat(newLinkObject));

                            setShowNewForm(false);
                            updateContentHeight(folderLinks);

                        } else {
                            let newLinks = [...userLinks];
                            let originalLinks = [...originalArray];

                            const newLinkObject = {
                                id: data.link_id,
                                name: currentLink.name,
                                url: URL,
                                email: currentLink.email,
                                phone: currentLink.phone,
                                icon: currentLink.icon,
                                position: data.position,
                                active_status: true
                            }
                            setOriginalArray(originalLinks.concat(newLinkObject));
                            setUserLinks(newLinks.concat(newLinkObject));

                            setShowNewForm(false);
                            updateContentHeight(originalArray);
                        }



                    }
                })

            }
        }

    };

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

        if(currentLink.url && currentLink.name) {

            setShowLoader(true)
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
                if (URL && currentLink.name) {
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
                        };
                        break;
                }

                addLink(packets).then((data) => {
                    setShowLoader(false);

                    if (data.success) {

                        if (folderID) {
                            let newFolderLinks = [...folderLinks];
                            let newOriginalFolderLinks = [...originalFolderLinks];

                            const newLinkObject = {
                                id: data.link_id,
                                folder_id: folderID,
                                name: currentLink.name,
                                url: URL,
                                email: currentLink.email,
                                phone: currentLink.phone,
                                icon: data.icon_path,
                                position: data.position,
                                active_status: true
                            }

                            setUserLinks (
                                userLinks.map((item) => {
                                    if (item.id === folderID) {
                                        const itemLinks = item.links.concat(newLinkObject)

                                        return {
                                            ...item,
                                            links: itemLinks
                                        }
                                    }

                                    return item;

                                })
                            )

                            setOriginalArray (
                                originalArray.map((item) => {
                                    if (item.id === folderID) {
                                        const itemLinks = item.links.concat(newLinkObject)

                                        return {
                                            ...item,
                                            links: itemLinks
                                        }
                                    }

                                    return item;

                                })
                            )

                            setOriginalFolderLinks(newOriginalFolderLinks.concat(newLinkObject));
                            setFolderLinks(newFolderLinks.concat(newLinkObject));

                            setShowNewForm(false);
                            updateContentHeight(folderLinks);

                        } else {
                            let newLinks = [...userLinks];
                            let originalLinks = [...originalArray];

                            const newLinkObject = {
                                id: data.link_id,
                                name: currentLink.name,
                                url: URL,
                                email: currentLink.email,
                                phone: currentLink.phone,
                                icon: data.icon_path,
                                position: data.position,
                                active_status: true
                            }

                            setOriginalArray(originalLinks.concat(newLinkObject));
                            setUserLinks(newLinks.concat(newLinkObject));

                            setShowNewForm(false);
                            updateContentHeight(originalArray);
                        }

                        setCustomIconArray(customIconArray => [
                            ...customIconArray,
                            data.icon_path
                        ]);

                    }
                })

            }).catch(error => {
                console.log(error);
                /*if (error.response) {
                    EventBus.dispatch("error", { message: error.response.data.errors.profile_img[0] });
                    console.log("ERROR: " + error.response);
                } else {
                    console.log("ERROR:: ", error);
                }*/
            });
        } else {
            EventBus.dispatch("error", { message: "Icon URL and Name is Required" });
        }
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

    const handleLinkName = useCallback ( (e) => {
            let value = e.target.value;

            setCharactersLeft(11 - value.length);

            setCurrentLink((state) => ({
                ...currentLink,
                name: value
            }))
        }
    )

    return (
        <>
            <div className="my_row icon_breadcrumb">
                <p>Adding Icon</p>
                <div className="breadcrumb_links">
                    {folderID ?
                        <>
                            <a className="back" href="#"
                               onClick={(e) => { e.preventDefault(); setShowNewForm(false); }}
                            >
                                <BiChevronLeft />
                                Folder
                            </a>
                            <a className="back" href="#"
                               onClick={(e) => { e.preventDefault(); setEditFolderID(false); setShowNewForm(false); }}
                            >
                                <BiChevronsLeft />
                                Icons
                            </a>
                        </>
                        :
                        <a className="back" href="#"
                           onClick={(e) => { e.preventDefault(); setShowNewForm(false); }}
                        >
                            <BiChevronLeft />
                            Back To Icons
                        </a>
                    }
                </div>
            </div>
            <div className="edit_form link my_row" key={999}>
                <form onSubmit={handleSubmit} className="link_form">
                    <div className="row">
                        <div className="col-12">
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
                                            <input type="radio" value="standard" name="icon_type"
                                                   checked={radioValue === "standard"}
                                                   onChange={(e) => {setRadioValue(e.target.value) }}/>
                                            <label htmlFor="icon_type">Standard Icons</label>
                                        </div>
                                        <div className={radioValue === "custom" ? "radio_wrap active" : "radio_wrap" }>
                                            <input type="radio" value="custom" name="icon_type"
                                                   onChange={(e) => {setRadioValue(e.target.value) }}
                                                   disabled={subStatus}
                                                   checked={radioValue === "custom"}
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
                                    /*maxLength="13"*/
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
                                <p className="char_max">Max 11 Characters Shown</p>
                                <p className="char_count">
                                    {charactersLeft < 0 ?
                                        <span className="over">Only 11 Characters Will Be Shown</span>
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
                                setShowNewForm(false);
                                document.getElementById('left_col_wrap').style.minHeight = "unset";
                            }}>
                                Cancel
                            </a>
                            <a className="help_link" href="mailto:help@link.pro">Need Help?</a>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default NewForm;