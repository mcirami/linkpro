import React, {
    createRef,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import IconList from "../IconList";
import {
    UserLinksContext,
    OriginalArrayContext,
    PageContext,
    FolderLinksContext,
    OriginalFolderLinksContext,
} from '../../../App';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import InputComponent from './InputComponent';
const iconPaths = user.icons;
import {
    addLink,
    updateLink,
    checkURL,
    updateLinkStatus,
} from '../../../../../Services/LinksRequest';
import {completedImageCrop, getIconPaths} from '../../../../../Services/ImageService';
import EventBus from '../../../../../Utils/Bus';
import {
    LINKS_ACTIONS,
    ORIGINAL_LINKS_ACTIONS,
    FOLDER_LINKS_ACTIONS,
    ORIG_FOLDER_LINKS_ACTIONS
} from '../../../../../Services/Reducer';
import FormBreadcrumbs from './FormBreadcrumbs';
import InputTypeRadio from './InputTypeRadio';
import FormTabs from './FormTabs';
import {getMailchimpLists, getAllProducts} from '../../../../../Services/UserService';
import MailchimpIntegration from './Mailchimp/MailchimpIntegration';
import ShopifyIntegration from './Shopify/ShopifyIntegration';
import {Loader} from '../../../../../Utils/Loader';
import IntegrationType from './IntegrationType';
import {isEmpty} from 'lodash';

const LinkForm = ({
                      setShowLinkForm,
                      folderID,
                      setEditFolderID,
                      editID,
                      setEditID,
                      setShowUpgradePopup,
                      setShowConfirmPopup,
                      setShowMessageAlertPopup,
                      setOptionText,
                      customIconArray,
                      setCustomIconArray,
                      subStatus,
                      radioValue,
                      setRadioValue,
                      redirected,
                      setRedirected,
                      connectionError,
                      showLoader,
                      setShowLoader,
                      inputType,
                      setInputType,
                      integrationType,
                      setIntegrationType,

}) => {

    const { userLinks, dispatch } = useContext(UserLinksContext);
    const { originalArray, dispatchOrig } = useContext(OriginalArrayContext);
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    const { originalFolderLinks, dispatchOrigFolderLinks } = useContext(OriginalFolderLinksContext);
    const  { pageSettings } = useContext(PageContext);
    const iconRef = createRef(null)
    const [completedIconCrop, setCompletedIconCrop] = useState(null);
    // if a custom icon is selected
    const [iconSelected, setIconSelected] = useState(false);

    //image cropping
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = iconRef;
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });
    const [customIcon, setCustomIcon] = useState(null);
    let iconArray = getIconPaths(iconPaths);

    const [lists, setLists] = useState(null);
    const [charactersLeft, setCharactersLeft] = useState();

    const [allProducts, setAllProducts] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [displayAllProducts, setDisplayAllProducts] = useState(false);

    const [currentLink, setCurrentLink] = useState (() => (

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
            shopify_products: null
        }
    ))

    const [input, setInput] = useState("");
   /* const [inputType, setInputType] = useState(
        currentLink.email && "email" ||
        currentLink.url && "url" ||
        currentLink.phone && "phone" ||
        currentLink.mailchimp_list_id && "mailchimp_list" ||
        currentLink.shopify_products && "shopify" ||
        null
    );*/

    useEffect(() => {

        setInputType(
            currentLink.email && "email" ||
            currentLink.url && "url" ||
            currentLink.phone && "phone" ||
            currentLink.mailchimp_list_id && "mailchimp" ||
            currentLink.shopify_products && "shopify" ||
            "url"
        )

    },[])

    useEffect(() => {

        if (inputType === "mailchimp" || currentLink.mailchimp_list_id) {
            fetchLists();
        }
        if (inputType === "shopify"  || currentLink.shopify_products) {
            fetchProducts()
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
        if(currentLink.icon?.includes("custom-icon") && !currentLink.mailchimp_list_id && !currentLink.shopify_products) {
            setRadioValue("custom");
        } else if (currentLink.mailchimp_list_id || currentLink.shopify_products || redirected) {
            setRadioValue("integration")
            setInputType(redirected)
            setRedirected(null);
        } else {
            setRadioValue("standard")
        }
    },[])

    const fetchLists = () => {

        setShowLoader({show: true, icon: "loading", position: "absolute"});

        getMailchimpLists().then(
            (data) => {
                if (data.success) {
                    !isEmpty(data.lists) && setLists(data.lists);
                    setIntegrationType("mailchimp");
                    setShowLoader({show: false, icon: "", position: ""});
                }
            }
        )
    }

    const fetchProducts = () => {

        setShowLoader({show: true, icon: "loading", position: "absolute"});

        getAllProducts().then(
            (data) => {
                if (data.success) {
                    !isEmpty(data.products) && setAllProducts(data.products);
                    setIntegrationType("shopify");
                    setShowLoader({show: false, icon: "", position: ""});
                }
            }
        )
    }

    const handleOnClick = e => {
        const type = e.target.dataset.type;

        if (!subStatus) {

            let text;
            if (type === "custom" ) {
                text = "add custom icons"
            } else if (type === "integration") {
                text = "add an integration"
            } else {
                text = "change link name"
            }

            setShowUpgradePopup(true);
            setOptionText(text);
        }

        if(folderID && type === "integration") {
            setShowMessageAlertPopup(true);
            setOptionText("Integrations are currently not allowed in a folder.");
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        setInput(e.target.value);

        if (e.target.value.length > 0 ) {
            iconArray = iconArray.filter((i) => {
                const iconName = i.name.toLowerCase().replace(" ", "");
                const userInput = input.toLowerCase().replace(" ", "");
                return iconName.match(userInput);
            });
        }
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

        // check if more another mailchimp form already exists.
        if (checkForMailchimpForm() === undefined || inputType !== "mailchimp") {

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
                    data = checkURL(URL, currentLink.name, null,
                        !subStatus);
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
                        case "mailchimp":
                            packets = {
                                name: currentLink.name,
                                mailchimp_list_id: currentLink.mailchimp_list_id,
                                icon: currentLink.icon,
                                page_id: pageSettings["id"],
                                folder_id: folderID,
                                type: currentLink.type,
                            };
                            break;
                        case "shopify":
                            packets = {
                                name: currentLink.name,
                                shopify_products: currentLink.shopify_products,
                                icon: currentLink.icon,
                                page_id: pageSettings["id"],
                                folder_id: folderID,
                                type: currentLink.type,
                            };
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
                                    let newFolderLinks = [...folderLinks];
                                    let newOriginalFolderLinks = [...originalFolderLinks];

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
                                        icon: currentLink.icon,
                                        position: data.position,
                                        active_status: true
                                    }

                                    newFolderLinks = newFolderLinks.concat(
                                        newLinkObject);

                                    dispatchOrigFolderLinks({
                                        type: ORIG_FOLDER_LINKS_ACTIONS.SET_ORIG_FOLDER_LINKS,
                                        payload: {
                                            links: newOriginalFolderLinks.concat(
                                                newLinkObject)
                                        }
                                    })
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

                                    dispatchOrig({
                                        type: ORIGINAL_LINKS_ACTIONS.ADD_NEW_IN_FOLDER,
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

                                    dispatchOrig({
                                        type: ORIGINAL_LINKS_ACTIONS.UPDATE_LINK,
                                        payload: {
                                            editID: editID,
                                            currentLink: currentLink,
                                            url: URL,
                                            iconPath: currentLink.icon
                                        }
                                    })

                                } else {
                                    let newLinks = [...userLinks];
                                    let originalLinks = [...originalArray];

                                    const newLinkObject = {
                                        id: data.link_id,
                                        name: currentLink.name,
                                        url: URL,
                                        email: currentLink.email,
                                        phone: currentLink.phone,
                                        type: currentLink.type,
                                        mailchimp_list_id: currentLink.mailchimp_list_id,
                                        shopify_products: currentLink.shopify_products,
                                        icon: currentLink.icon,
                                        position: data.position,
                                        active_status: true
                                    }

                                    dispatchOrig({
                                        type: ORIGINAL_LINKS_ACTIONS.SET_ORIGINAL_LINKS,
                                        payload: {
                                            links: originalLinks.concat(
                                                newLinkObject)
                                        }
                                    })
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
                                shopify_products: null
                            })

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

        if(currentLink.name && (currentLink.url || currentLink.email || currentLink.phone || currentLink.mailchimp_list_id || !isEmpty(currentLink.shopify_products)) ) {

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
                    case "mailchimp":
                        packets = {
                            name: currentLink.name,
                            mailchimp_list_id: currentLink.mailchimp_list_id,
                            icon: response.key,
                            page_id: pageSettings["id"],
                            ext: response.extension,
                            folder_id: folderID,
                            type: currentLink.type,
                        };
                        break;
                    case "shopify":
                        packets = {
                            name: currentLink.name,
                            shopify_products: currentLink.shopify_products,
                            icon: response.key,
                            page_id: pageSettings["id"],
                            ext: response.extension,
                            folder_id: folderID,
                            type: currentLink.type,
                        };
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
                                let newFolderLinks = [...folderLinks];
                                let newOriginalFolderLinks = [...originalFolderLinks];

                                const newLinkObject = {
                                    id: data.link_id,
                                    folder_id: folderID,
                                    name: currentLink.name,
                                    url: URL,
                                    email: currentLink.email,
                                    phone: currentLink.phone,
                                    mailchimp_list_id: currentLink.mailchimp_list_id,
                                    shopify_products: currentLink.shopify_products,
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

                                dispatchOrig({
                                    type: ORIGINAL_LINKS_ACTIONS.ADD_NEW_IN_FOLDER,
                                    payload: {
                                        newLinkObject: newLinkObject,
                                        folderActive: folderActive,
                                        folderID: folderID
                                    }})

                                dispatchOrigFolderLinks({
                                    type: ORIG_FOLDER_LINKS_ACTIONS.SET_ORIG_FOLDER_LINKS,
                                    payload: {
                                        links: newOriginalFolderLinks.concat(newLinkObject)
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
                            } else {
                                let newLinks = [...userLinks];
                                let originalLinks = [...originalArray];

                                const newLinkObject = {
                                    id: data.link_id,
                                    name: currentLink.name,
                                    url: URL,
                                    email: currentLink.email,
                                    phone: currentLink.phone,
                                    type: currentLink.type,
                                    mailchimp_list_id: currentLink.mailchimp_list_id,
                                    shopify_products: currentLink.shopify_products,
                                    icon: data.icon_path,
                                    position: data.position,
                                    active_status: true
                                }

                                dispatchOrig({
                                    type: ORIGINAL_LINKS_ACTIONS.SET_ORIGINAL_LINKS,
                                    payload: {
                                        links: originalLinks.concat(newLinkObject)
                                    }})
                                dispatch({
                                    type: LINKS_ACTIONS.SET_LINKS,
                                    payload: {
                                        links: newLinks.concat(newLinkObject)
                                    }})
                            }

                        }

                        setShowLinkForm(false);
                        setEditID(null)
                        setCurrentLink({
                            icon: null,
                            name: null,
                            url: null,
                            email: null,
                            phone: null,
                            mailchimp_list_id: null,
                            shopify_products: null
                        })

                        setCustomIconArray(customIconArray => [
                            ...customIconArray,
                            data.icon_path
                        ]);

                    }
                })

            }).catch(error => {
                console.error(error);
            });
        } else {
            EventBus.dispatch("error", { message: "Icon Destination and Name is Required" });
        }
    }

    const handleLinkName = useCallback ( (e) => {
            let value = e.target.value;

            setCharactersLeft(11 - value.length);

            setCurrentLink(() => ({
                ...currentLink,
                name: value
            }))
        }
    )

    const checkForMailchimpForm = () => {
        const link = userLinks.find(function(e) {
            return e.mailchimp_list_id
        })

        if(link?.id === editID) {
            return false
        }

        return link;
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setEditID(null);
        setShowLinkForm(false);
        setInputType(null);
        setIntegrationType(null);
        document.getElementById(
            'left_col_wrap').style.minHeight = "unset";
    }

    return (
        <>
            <div className="my_row icon_breadcrumb" id="scrollTo">
                <p>{editID ? "Editing" : "Adding" } Icon</p>
                <FormBreadcrumbs
                    setEditFolderID={setEditFolderID}
                    setShowLinkForm={setShowLinkForm}
                    folderID={folderID}
                    iconSelected={iconSelected}
                    setEditID={setEditID}
                    setShowConfirmPopup={setShowConfirmPopup}
                    editID={editID}
                    setIntegrationType={setIntegrationType}
                    setInputType={setInputType}
                />
            </div>
            <div className="edit_form link my_row">
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
                            integrationType={integrationType}
                            editID={editID}
                        />
                    </div>

                    <div className="inner_wrap">

                        { (showLoader.show && showLoader.position === "absolute") &&
                            <Loader
                                showLoader={showLoader}
                            />
                        }


                        {radioValue === "integration" &&

                            <>
                                <IntegrationType
                                    integrationType={integrationType}
                                    setIntegrationType={setIntegrationType}
                                    setInputType={setInputType}
                                />

                                {(integrationType === "mailchimp" && !lists) &&
                                    <MailchimpIntegration
                                        connectionError={connectionError}
                                        inputType={inputType}
                                    />
                                }

                                {(integrationType === "shopify" && !allProducts) &&
                                    <ShopifyIntegration
                                        connectionError={connectionError}
                                        inputType={inputType}
                                    />
                                }
                            </>

                        }

                        { ( (integrationType === "mailchimp" && lists) || (integrationType === "shopify" && allProducts ) || radioValue !== "integration") &&
                            <form onSubmit={handleSubmit} className="link_form">
                                <div className="row">
                                    <div className="col-12">
                                        {(radioValue === "custom" || radioValue === "integration") &&
                                            <div className={!iconSelected ?
                                                "crop_section hidden" :
                                                "crop_section"}>
                                                {iconSelected &&
                                                    <p>Crop Icon</p>
                                                }
                                                <ReactCrop
                                                    src={upImg}
                                                    onImageLoaded={onLoad}
                                                    crop={crop}
                                                    onChange={(c) => setCrop(c)}
                                                    onComplete={(c) => setCompletedIconCrop(
                                                        c)}
                                                />
                                                <div className="icon_col">
                                                    {iconSelected &&
                                                        <p>Icon Preview</p>
                                                    }
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
                                        }
                                        {!displayAllProducts &&
                                            <div className="icon_row">
                                                <div className="icon_box">

                                                    <div className="uploader">
                                                        {(radioValue === "custom" ||
                                                            radioValue ===
                                                            "integration") ?

                                                            <>
                                                                <label htmlFor="custom_icon_upload" className="custom text-uppercase button blue">
                                                                    Upload Image
                                                                </label>
                                                                <input id="custom_icon_upload" type="file" className="custom" onChange={selectCustomIcon} accept="image/png, image/jpeg, image/jpg, image/gif"/>
                                                                <div className="my_row info_text file_types text-center mb-2">
                                                                    <p className="m-0 char_count w-100 ">Allowed File Types: <span>png, jpg, jpeg, gif</span>
                                                                    </p>
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                                <input name="search" type="text" placeholder="Search Icons" onChange={handleChange} defaultValue={input}/>
                                                                <div className="my_row info_text file_types text-center mb-2 text-center">
                                                                    <a href="mailto:help@link.pro" className="mx-auto m-0 char_count">Don't See Your Icon? Contact Us!</a>
                                                                </div>
                                                            </>
                                                        }
                                                    </div>

                                                    <IconList
                                                        currentLink={currentLink}
                                                        setCurrentLink={setCurrentLink}
                                                        iconArray={iconArray}
                                                        radioValue={radioValue}
                                                        setCharactersLeft={setCharactersLeft}
                                                        customIconArray={customIconArray}
                                                        inputType={inputType}
                                                        setInputType={setInputType}
                                                        editID={editID}
                                                    />

                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                {!displayAllProducts &&
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="input_wrap">
                                                <input
                                                    /*maxLength="13"*/
                                                    name="name"
                                                    type="text"
                                                    value={currentLink.name ||
                                                        ""}
                                                    placeholder="Link Name"
                                                    onChange={(e) => handleLinkName(
                                                        e)}
                                                    disabled={!subStatus}
                                                    className={!subStatus ? "disabled" : ""}
                                                />
                                                {!subStatus &&
                                                    <span className="disabled_wrap"
                                                          data-type="name"
                                                          onClick={(e) => handleOnClick(e)}>
                                                    </span>
                                                }
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
                                }
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
                                            setInputType={setInputType}
                                            currentLink={currentLink}
                                            editID={editID}
                                            setCurrentLink={setCurrentLink}
                                            lists={lists}
                                            setLists={setLists}
                                            allProducts={allProducts}
                                            selectedProducts={selectedProducts}
                                            setSelectedProducts={setSelectedProducts}
                                            displayAllProducts={displayAllProducts}
                                            setDisplayAllProducts={setDisplayAllProducts}
                                        />
                                    </div>
                                </div>
                                {!displayAllProducts &&
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
                                }
                            </form>
                        }

                    </div>
                </div>
            </div>
        </>
    );
};

export default LinkForm;
