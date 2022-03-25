import React, {
    createRef,
    useCallback,
    useContext, useEffect,
    useRef,
    useState,
} from 'react';
import IconList from "./IconList";
import {MdDeleteForever} from 'react-icons/md';
import { UserLinksContext, OriginalArrayContext, PageContext, FolderLinksContext, OriginalFolderLinksContext } from '../App';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import InputComponent from './InputComponent';
const iconPaths = user.icons;
import {updateLink, checkURL} from '../../../../Services/LinksRequest';
import {completedImageCrop, getIconPaths} from '../../../../Services/ImageService';
import {BiChevronLeft, BiChevronsLeft} from 'react-icons/bi';

const EditForm = ({
                      editID,
                      setEditID,
                      setShowUpgradePopup,
                      setShowConfirmPopup,
                      setOptionText,
                      customIconArray,
                      setCustomIconArray,
                      setShowLoader,
                      folderID,
                      setEditFolderID,
                      subStatus
}) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const { originalArray, setOriginalArray } = useContext(OriginalArrayContext);
    const  { pageSettings, setPageSettings } = useContext(PageContext);
    const { folderLinks, setFolderLinks } = useContext(FolderLinksContext);
    const { originalFolderLinks, setOriginalFolderLinks } = useContext(OriginalFolderLinksContext);

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

    let iconArray = getIconPaths(iconPaths);

    const [ currentLink, setCurrentLink ] = useState(
        userLinks.find(function(e) {
            return e.id === editID && !e.type
        }) || folderLinks.find(function(e) {
            return e.id === editID
        }) );

    const [inputType, setInputType] = useState(
        currentLink.email && "email" || currentLink.url && "url" || currentLink.phone && "phone"
    );

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

        completedImageCrop(completedIconCrop, imgRef, previewCanvasRef);

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
                        };
                        break;
                    case "email":
                        packets = {
                            name: currentLink.name,
                            email: currentLink.email,
                            icon: currentLink.icon,
                            page_id: pageSettings["id"],
                        };
                        break;
                    case "phone":
                        packets = {
                            name: currentLink.name,
                            phone: currentLink.phone,
                            icon: currentLink.icon,
                            page_id: pageSettings["id"],
                        };
                        break;
                }

                updateLink(packets, editID)
                .then((data) => {

                    if (data.success) {
                        if(folderID) {
                            setFolderLinks(
                                folderLinks.map((item) => {
                                    if (item.id === editID) {
                                        return {
                                            ...item,
                                            name: currentLink.name,
                                            url: URL,
                                            email: currentLink.email,
                                            phone: currentLink.phone,
                                            icon: currentLink.icon
                                        }
                                    }

                                    return item;
                                })
                            )

                            setOriginalFolderLinks(
                                originalFolderLinks.map((item) => {
                                    if (item.id === editID) {
                                        return {
                                            ...item,
                                            name: currentLink.name,
                                            url: URL,
                                            email: currentLink.email,
                                            phone: currentLink.phone,
                                            icon: currentLink.icon
                                        }
                                    }

                                    return item;
                                })
                            )

                            setUserLinks(
                                userLinks.map((item) => {
                                    if (item.id === folderID && item.type === "folder") {

                                        const newItemsLinks = item.links.map((linkItem) => {

                                            if (linkItem.id === editID) {

                                                return  {
                                                    ...linkItem,
                                                    name: currentLink.name,
                                                    url: URL,
                                                    email: currentLink.email,
                                                    phone: currentLink.phone,
                                                    icon: currentLink.icon
                                                }
                                            }

                                            return linkItem
                                        })

                                        return {
                                            ...item,
                                            links: newItemsLinks
                                        }
                                    }

                                    return item;
                                })
                            )

                            setOriginalArray(
                                originalArray.map((item) => {
                                    if (item.id === folderID && item.type === "folder") {

                                        const newItemsLinks = item.links.map((linkItem) => {

                                            if (linkItem.id === editID) {

                                                return {
                                                    ...item,
                                                    name: currentLink.name,
                                                    url: URL,
                                                    email: currentLink.email,
                                                    phone: currentLink.phone,
                                                    icon: currentLink.icon
                                                }
                                            }

                                            return linkItem
                                        })

                                        return {
                                            ...item,
                                            links: newItemsLinks
                                        }
                                    }

                                    return item;
                                })
                            )

                        } else {
                            setUserLinks (
                                userLinks.map((item) => {
                                    if (item.id === editID && item.type !== "folder") {
                                        return {
                                            ...item,
                                            name: currentLink.name,
                                            url: URL,
                                            email: currentLink.email,
                                            phone: currentLink.phone,
                                            icon: currentLink.icon
                                        }
                                    }

                                    return item;
                                })
                            )

                            setOriginalArray (
                                originalArray.map((item) => {
                                    if (item.id === editID && item.type !== "folder") {
                                        return {
                                            ...item,
                                            name: currentLink.name,
                                            url: URL,
                                            email: currentLink.email,
                                            phone: currentLink.phone,
                                            icon: currentLink.icon
                                        }
                                    }

                                    return item;
                                })
                            )
                        }

                        setEditID(null)
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

            const URL = checkURL(currentLink.url, null, true);
            let packets;

            switch (inputType) {
                case "url":
                    packets = {
                        name: currentLink.name,
                        url: URL,
                        icon: response.key,
                        page_id: pageSettings["id"],
                        ext: response.extension,
                    };
                    break;
                case "email":
                    packets = {
                        name: currentLink.name,
                        email: currentLink.email,
                        icon: response.key,
                        page_id: pageSettings["id"],
                        ext: response.extension,
                    };
                    break;
                case "phone":
                    packets = {
                        name: currentLink.name,
                        phone: currentLink.phone,
                        icon: response.key,
                        page_id: pageSettings["id"],
                        ext: response.extension,
                    };
                    break;
            }

            updateLink(packets, editID)
            .then((data) => {
                setShowLoader(false);

                if (data.success) {

                    if (folderID) {

                        setFolderLinks(
                            folderLinks.map((item) => {
                                if (item.id === editID) {
                                    return {
                                        ...item,
                                        name: currentLink.name,
                                        url: URL,
                                        email: currentLink.email,
                                        phone: currentLink.phone,
                                        icon: data.iconPath
                                    }
                                }

                                return item;
                            })
                        )

                        setOriginalFolderLinks(
                            originalFolderLinks.map((item) => {
                                if (item.id === editID) {
                                    return {
                                        ...item,
                                        name: currentLink.name,
                                        url: URL,
                                        email: currentLink.email,
                                        phone: currentLink.phone,
                                        icon: data.iconPath
                                    }
                                }

                                return item;
                            })
                        )

                        setUserLinks(
                            userLinks.map((item) => {
                                if (item.id === folderID && item.type === "folder") {

                                    const newItemLinks = item.links.map((linkItem) => {

                                        if (linkItem.id === editID) {

                                            return {
                                                ...item,
                                                name: currentLink.name,
                                                url: URL,
                                                email: currentLink.email,
                                                phone: currentLink.phone,
                                                icon: data.iconPath
                                            }
                                        }

                                        return linkItem
                                    })

                                    return {
                                        ...item,
                                        links: newItemLinks
                                    }
                                }

                                return item;
                            })
                        )

                        setOriginalArray(
                            originalArray.map((item) => {
                                if (item.id === folderID && item.type === "folder") {

                                    const newItemLinks = item.links.map((linkItem) => {

                                        if (linkItem.id === editID) {

                                            return {
                                                ...item,
                                                name: currentLink.name,
                                                url: URL,
                                                email: currentLink.email,
                                                phone: currentLink.phone,
                                                icon: data.iconPath
                                            }
                                        }

                                        return linkItem
                                    })

                                    return {
                                        ...item,
                                        links: newItemLinks
                                    }
                                }

                                return item;
                            })
                        )

                    } else {
                        setUserLinks (
                            userLinks.map((item) => {
                                if (item.id === editID && item.type !== "folder") {
                                    return {
                                        ...item,
                                        name: currentLink.name,
                                        url: URL,
                                        email: currentLink.email,
                                        phone: currentLink.phone,
                                        icon: data.iconPath
                                    }
                                }

                                return item;
                            })
                        )
                        setOriginalArray (
                            originalArray.map((item) => {
                                if (item.id === editID && item.type !== "folder") {
                                    return {
                                        ...item,
                                        name: currentLink.name,
                                        url: URL,
                                        email: currentLink.email,
                                        phone: currentLink.phone,
                                        icon: data.iconPath
                                    }
                                }

                                return item;
                            })
                        )
                    }

                    setCustomIconArray( customIconArray => [
                        ...customIconArray,
                        data.iconPath
                    ]);

                    setEditID(null)
                }
            })
        }).catch(error => {
            if (error.response) {
                console.log("ERROR: " + error.response);
            } else {
                console.log("ERROR:: ", error);
            }
        });
    }

    const handleOnClick = e => {
        if (!subStatus) {

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
        let value = e.target.value;

        setCharactersLeft(11 - value.length);

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
        <>
            <div className="my_row icon_breadcrumb" id="scrollTo">
                <p>Editing Icon</p>
                <div className="breadcrumb_links">
                    {folderID ?
                        <>
                            <a className="back" href="#"
                               onClick={(e) => { e.preventDefault(); setEditID(null); }}
                            >
                                <BiChevronLeft />
                                Folder
                            </a>
                            <a className="back" href="#"
                               onClick={(e) => { e.preventDefault(); setEditFolderID(false); setEditID(null); }}
                            >
                                <BiChevronsLeft />
                                Icons
                            </a>
                        </>
                        :
                        <a className="back" href="#"
                           onClick={(e) => { e.preventDefault(); setEditID(null); }}
                        >
                            <BiChevronLeft />
                            Back To Icons
                        </a>
                    }
                    {!iconSelected &&
                        <div className="delete_icon">
                            <a className="delete" href="#" onClick={handleDeleteClick}><MdDeleteForever /></a>
                            <div className="hover_text delete_folder"><p>Delete Icon</p></div>
                        </div>
                    }

                </div>
            </div>
            <div className="my_row edit_form link" key={editID}>
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
                                            <label htmlFor="standard_radio">
                                                <input id="standard_radio" type="radio" value="standard" name="icon_type" defaultChecked
                                                       onChange={(e) => {setRadioValue(e.target.value) }}
                                                />
                                                Standard Icons
                                            </label>
                                        </div>
                                        <div className={radioValue === "custom" ? "radio_wrap active" : "radio_wrap" }>
                                            <label htmlFor="custom_radio">
                                                <input id="custom_radio" type="radio" value="custom" name="icon_type"
                                                       onChange={(e) => {setRadioValue(e.target.value); }}
                                                       disabled={!subStatus}
                                                />
                                                Custom Icons
                                            </label>
                                            {!subStatus && <span className="disabled_wrap" data-type="custom" onClick={(e) => handleOnClick(e)} />}
                                        </div>
                                    </div>

                                    {radioValue === "custom" ?
                                        <div className="uploader">
                                            <label htmlFor="custom_icon_upload" className="custom text-uppercase button blue">
                                                Upload Image
                                            </label>
                                            <input id="custom_icon_upload" type="file" className="custom" onChange={selectCustomIcon} accept="image/png, image/jpeg, image/jpg, image/gif"/>
                                            <div className="my_row info_text file_types text-center mb-2">
                                                <p className="m-0 char_count w-100 ">Allowed File Types: <span>png, jpg, jpeg, gif</span></p>
                                            </div>
                                        </div>
                                        :
                                        <div className="uploader">
                                            <input name="search" type="text" placeholder="Search Icons" onChange={handleChange} defaultValue={input} />
                                            <div className="my_row info_text file_types text-center mb-2 text-center">
                                                <a href="mailto:help@link.pro" className="mx-auto m-0 char_count">Don't See Your Icon? Contact Us!</a>
                                            </div>
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
                                    disabled={!subStatus}
                                    className={!subStatus ? "disabled" : ""}
                                />
                                {!subStatus && <span className="disabled_wrap" data-type="name" onClick={(e) => handleOnClick(e)}> </span>}
                            </div>
                            <div className="my_row info_text title">
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
        </>
    );
};

export default EditForm;
