import React, {
    createRef,
    useCallback,
    useContext, useEffect,
    useRef,
    useState,
} from 'react';
import IconList from "../IconList";
import { UserLinksContext, OriginalArrayContext, PageContext, FolderLinksContext, OriginalFolderLinksContext } from '../../../App';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import InputComponent from './InputComponent';
const iconPaths = user.icons;
import {updateLink, checkURL} from '../../../../../Services/LinksRequest';
import {completedImageCrop, getIconPaths} from '../../../../../Services/ImageService';
import FormBreadcrumbs from './FormBreadcrumbs';

import {
    LINKS_ACTIONS,
    ORIGINAL_LINKS_ACTIONS,
    FOLDER_LINKS_ACTIONS,
    ORIG_FOLDER_LINKS_ACTIONS
} from '../../../../../Services/Reducer';
import FormTabs from './FormTabs';
import InputTypeRadio from './InputTypeRadio';
import {getMailchimpLists} from '../../../../../Services/UserService';
import MailchimpIntegration from './MailchimpIntegration';

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
                      subStatus,
                      radioValue,
                      setRadioValue,
                      redirected,
                      setRedirected,
                      setShowMessageAlertPopup,
                      connectionError
}) => {

    const { userLinks, dispatch  } = useContext(UserLinksContext);
    const { dispatchOrig } = useContext(OriginalArrayContext);
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    const { dispatchOrigFolderLinks } = useContext(OriginalFolderLinksContext);
    const  { pageSettings } = useContext(PageContext);

    const iconRef = createRef(null)
    const [completedIconCrop, setCompletedIconCrop] = useState(null);
    const [iconSelected, setIconSelected] = useState(false);

    //image cropping
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = iconRef;
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });
    const [customIcon] = useState(null);

    const [lists, setLists] = useState(null);

    let iconArray = getIconPaths(iconPaths);

    const [ currentLink, setCurrentLink ] = useState(
        userLinks.find(function(e) {
            return e.id === editID
        }) || folderLinks.find(function(e) {
            return e.id === editID
        }) );

    const [inputType, setInputType] = useState(
        currentLink.email && "email" || currentLink.url && "url" || currentLink.phone && "phone"
    );

    const [charactersLeft, setCharactersLeft] = useState();
    const [input, setInput] = useState("");

    useEffect(() => {
        if (inputType === "mailchimp_list") {
            fetchLists()
        }
    }, [inputType]);


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

    useEffect(() => {
        if (!completedIconCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        completedImageCrop(completedIconCrop, imgRef, previewCanvasRef);

    }, [completedIconCrop]);

    useEffect(() => {
        if(currentLink.icon.includes("custom-icon") && !currentLink.mailchimp_list_id) {
            setRadioValue("custom");
        } else if (currentLink.mailchimp_list_id || redirected === true) {
            setRadioValue("integration")
            setInputType("mailchimp_list")
            setRedirected(false);
        } else {
            setRadioValue("standard")
        }
    },[])

    const fetchLists = () => {

        getMailchimpLists().then(
            (data) => {
                if (data.success) {
                    setLists(data.lists)
                }
            }
        )
    }

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
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (checkForMailchimpForm() || inputType !== "mailchimp_list") {

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
                                type: currentLink.type
                            };
                            break;
                        case "email":
                            packets = {
                                name: currentLink.name,
                                email: currentLink.email,
                                icon: currentLink.icon,
                                page_id: pageSettings["id"],
                                type: currentLink.type
                            };
                            break;
                        case "phone":
                            packets = {
                                name: currentLink.name,
                                phone: currentLink.phone,
                                icon: currentLink.icon,
                                page_id: pageSettings["id"],
                                type: currentLink.type
                            };
                            break;
                        case "mailchimp_list":
                            packets = {
                                name: currentLink.name,
                                mailchimp_list_id: currentLink.mailchimp_list_id,
                                icon: currentLink.icon,
                                page_id: pageSettings["id"],
                                folder_id: folderID,
                                type: currentLink.type
                            };
                            break;
                    }

                    updateLink(packets, editID).then((data) => {

                        if (data.success) {
                            if (folderID) {

                                dispatchFolderLinks({
                                    type: FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS,
                                    payload: {
                                        editID: editID,
                                        currentLink: currentLink,
                                        url: URL,
                                        iconPath: currentLink.icon
                                    }
                                })

                                dispatchOrigFolderLinks({
                                    type: ORIG_FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS,
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

                                dispatchOrig({
                                    type: ORIGINAL_LINKS_ACTIONS.UPDATE_LINK_IN_FOLDER,
                                    payload: {
                                        folderID: folderID,
                                        editID: editID,
                                        currentLink: currentLink,
                                        url: URL,
                                        iconPath: currentLink.icon
                                    }
                                })

                            } else {

                                dispatch({
                                    type: LINKS_ACTIONS.UPDATE_LINK,
                                    payload: {
                                        editID: editID,
                                        currentLink: currentLink,
                                        url: URL,
                                        iconPath: currentLink.icon
                                    }
                                })

                                dispatchOrig({
                                    type: ORIGINAL_LINKS_ACTIONS.UPDATE_LINK,
                                    payload: {
                                        editID: editID,
                                        currentLink: currentLink,
                                        url: URL,
                                        iconPath: currentLink.icon
                                    }
                                })
                            }

                            setEditID(null)
                        }
                    })

                }
            }
        } else {
            setShowMessageAlertPopup(true);
            setOptionText("Only 1 Mailchimp subscribe form is allowed per page.")
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

            let URL = currentLink.url;
            if (currentLink.url) {
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
                        type: currentLink.type
                    };
                    break;
                case "email":
                    packets = {
                        name: currentLink.name,
                        email: currentLink.email,
                        icon: response.key,
                        page_id: pageSettings["id"],
                        ext: response.extension,
                        type: currentLink.type
                    };
                    break;
                case "phone":
                    packets = {
                        name: currentLink.name,
                        phone: currentLink.phone,
                        icon: response.key,
                        page_id: pageSettings["id"],
                        ext: response.extension,
                        type: currentLink.type
                    };
                    break;
                case "mailchimp_list":
                    packets = {
                        name: currentLink.name,
                        mailchimp_list_id: currentLink.mailchimp_list_id,
                        icon: response.key,
                        page_id: pageSettings["id"],
                        folder_id: folderID,
                        type: currentLink.type
                    };
                    break;
            }

            updateLink(packets, editID)
            .then((data) => {
                setShowLoader(false);

                if (data.success) {

                    if (folderID) {

                        dispatchFolderLinks({
                            type: FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS,
                            payload: {
                                editID: editID,
                                currentLink: currentLink,
                                url: URL,
                                iconPath: data.iconPath
                            }})

                        dispatchOrigFolderLinks({
                            type: ORIG_FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS,
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

                        dispatchOrig({
                            type: ORIGINAL_LINKS_ACTIONS.UPDATE_LINK_IN_FOLDER,
                            payload: {
                                folderID: folderID,
                                editID: editID,
                                currentLink: currentLink,
                                url: URL,
                                iconPath: data.iconPath
                            }})

                    } else {

                        dispatch({
                            type: LINKS_ACTIONS.UPDATE_LINK,
                            payload: {
                                editID: editID,
                                currentLink: currentLink,
                                url: URL, iconPath:
                                data.iconPath
                            }})

                        dispatchOrig({
                            type: ORIGINAL_LINKS_ACTIONS.UPDATE_LINK,
                            payload: {
                                editID: editID,
                                currentLink: currentLink,
                                url: URL,
                                iconPath: data.iconPath
                            }})

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
                console.error("ERROR: " + error.response);
            } else {
                console.error("ERROR:: ", error);
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

            setShowUpgradePopup(true);
            setOptionText(text);
        }

        if (folderID) {
            setShowMessageAlertPopup(true);
            setOptionText("Integrations are currently not allowed in a folder.");
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

    const checkForMailchimpForm = () => {
        return userLinks.find(function(e) {
             if(e.mailchimp_list_id  != null && e.id === editID) {
                 return true
             } else if (e.mailchimp_list_id  != null)  {
                 return false
             }
        })
    }

    return (
        <>
            <div className="my_row icon_breadcrumb" id="scrollTo">
                <p>Editing Icon</p>
                <FormBreadcrumbs
                    folderID={folderID}
                    setEditID={setEditID}
                    setEditFolderID={setEditFolderID}
                    iconSelected={iconSelected}
                    setShowConfirmPopup={setShowConfirmPopup}
                    formType={"edit"}
                />
            </div>
            <div className="my_row edit_form link">
                <div className="tab_content_wrap my_row">

                    <div className="tabs">
                        <FormTabs
                            radioValue={radioValue}
                            setRadioValue={setRadioValue}
                            subStatus={subStatus}
                            inputType={inputType}
                            setInputType={setInputType}
                            setCurrentLink={setCurrentLink}
                            handleOnClick={handleOnClick}
                            folderID={folderID}
                        />
                    </div>

                    {(radioValue === "integration" && !lists) ?

                        <MailchimpIntegration
                            connectionError={connectionError}
                            inputType={inputType}
                            editID={editID}
                        />

                        :

                        <form onSubmit={handleSubmit} className="link_form">
                            <div className="row">
                                <div className="col-12">
                                    { (radioValue === "custom" || radioValue === "integration") ?
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

                                            { (radioValue === "custom" || radioValue === "integration") ?
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
                            {radioValue !== "integration" &&
                                <div className="row">
                                    <div className="col-12">
                                        <InputTypeRadio
                                            inputType={inputType}
                                            setInputType={setInputType}
                                            setCurrentLink={setCurrentLink}
                                        />
                                    </div>
                                </div>
                            }
                            <div className="row">
                                <div className="col-12">
                                    <InputComponent
                                        inputType={inputType}
                                        currentLink={currentLink}
                                        setCurrentLink={setCurrentLink}
                                        lists={lists}
                                        setLists={setLists}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 button_row">
                                    <button className="button green" type="submit">
                                        Save
                                    </button>
                                    <a href="resources/js/Pages/Dashboard/Components/Link/Forms/EditForm#" className="button transparent gray" onClick={(e) => {
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
                    }
                </div>
            </div>
        </>
    );
};

export default EditForm;
