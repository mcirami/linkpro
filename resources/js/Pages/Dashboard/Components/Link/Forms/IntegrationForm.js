import React, {useContext, createRef, useState, useRef, useEffect, useCallback} from 'react';
import IntegrationType from './IntegrationType';
import {isEmpty} from 'lodash';
import MailchimpIntegration from './Mailchimp/MailchimpIntegration';
import ShopifyIntegration from './Shopify/ShopifyIntegration';
import ReactCrop from 'react-image-crop';
import IconList from '../IconList';
import {
    PageContext,
    UserLinksContext,
} from '../../../App';
import {completedImageCrop} from '../../../../../Services/ImageService';
import {
    addLink,
    checkURL,
    updateLink,
} from '../../../../../Services/LinksRequest';
import {
    LINKS_ACTIONS,
} from '../../../../../Services/Reducer';
import EventBus from '../../../../../Utils/Bus';
import MailchimpLists from './Mailchimp/MailchimpLists';
import AllProducts from './Shopify/AllProducts';
import StoreDropdown from './Shopify/StoreDropdown';
import SelectedProducts from './Shopify/SelectedProducts';
import {HandleBlur, HandleFocus} from '../../../../../Utils/InputAnimations';

const IntegrationForm = ({
                             setAccordionValue,
                             accordionValue,
                             editID,
                             setShowLinkForm,
                             setEditID,
                             setOptionText,
                             setShowMessageAlertPopup,
                             setShowLoader,
                             setIntegrationType,
                             integrationType,
                             connectionError,
                             shopifyStores,
                             setShopifyStores,
                             redirectedType
}) => {

    const [customIconArray, setCustomIconArray] = useState([]);
    const { userLinks, dispatch } = useContext(UserLinksContext);
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

    // Mailchimp integration
    const [lists, setLists] = useState([]);

    const [charactersLeft, setCharactersLeft] = useState();

    //Shopify Integration
    const [allProducts, setAllProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [displayAllProducts, setDisplayAllProducts] = useState(false);
    const [showAddStore, setShowAddStore] = useState(false);

    const [currentLink, setCurrentLink] = useState (
        userLinks.find(function(e) {
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

    useEffect(() => {
        if(currentLink.shopify_products && currentLink.shopify_id) {
            setSelectedProducts(currentLink.shopify_products)
            setIntegrationType("shopify")
        }

        if (currentLink.mailchimp_list_id) {
            setIntegrationType("mailchimp")
        }
    },[])

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

        completedImageCrop(completedIconCrop, imgRef, previewCanvasRef.current);

    }, [completedIconCrop]);

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
        if (checkForMailchimpForm() === undefined || !checkForMailchimpForm() || integrationType === "shopify") {

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
                //let data;

                /*if (URL && currentLink.name) {
                    data = checkURL(URL, currentLink.name, null,
                        !subStatus);
                } else {
                    data = {
                        success: true,
                        url: URL
                    }
                }*/

                /*if (data["success"]) {*/

                    //URL = data["url"];
                    let packets;

                    switch (integrationType) {
                        case "mailchimp":
                            packets = {
                                name: currentLink.name,
                                mailchimp_list_id: currentLink.mailchimp_list_id,
                                icon: currentLink.icon,
                                page_id: pageSettings["id"],
                                type: "mailchimp",
                            };
                            break;
                        case "shopify":
                            packets = {
                                name: currentLink.name,
                                shopify_products: currentLink.shopify_products,
                                shopify_id: currentLink.shopify_id,
                                icon: currentLink.icon,
                                page_id: pageSettings["id"],
                                type: "shopify",
                            };
                            break;
                    }

                    const func = editID ? updateLink(packets, editID) : addLink(packets);

                    func.then((data) => {

                        if (data.success) {

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

                            setAccordionValue(null);
                            setShowLinkForm(false);
                            setIntegrationType(null);
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
               /* }*/
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

        if(currentLink.name &&
            (
                currentLink.mailchimp_list_id ||
                currentLink.shopify_products
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

                switch (integrationType) {
                    case "mailchimp":
                        packets = {
                            name: currentLink.name,
                            mailchimp_list_id: currentLink.mailchimp_list_id,
                            icon: response.key,
                            page_id: pageSettings["id"],
                            ext: response.extension,
                            type: "mailchimp",
                        };
                        break;
                    case "shopify":
                        packets = {
                            name: currentLink.name,
                            shopify_products: currentLink.shopify_products,
                            shopify_id: currentLink.shopify_id,
                            icon: response.key,
                            page_id: pageSettings["id"],
                            ext: response.extension,
                            type: "shopify",
                        };
                        break;
                }

                const func = editID ? updateLink(packets, editID) : addLink(packets);

                func.then((data) => {
                    setShowLoader({show: false, icon: null});

                    if (data.success) {

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
                                mailchimp_list_id: currentLink.mailchimp_list_id,
                                shopify_products: currentLink.shopify_products,
                                shopify_id: currentLink.shopify_id,
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

                        setCustomIconArray(customIconArray => [
                            ...customIconArray,
                            data.icon_path
                        ]);

                        setShowLinkForm(false);
                        setAccordionValue(null);
                        setEditID(null)
                        setIntegrationType(null);
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
        setIntegrationType(null);
        setAccordionValue(null);
        document.getElementById(
            'left_col_wrap').style.minHeight = "unset";
    }

    return (
        <>
            <IntegrationType
                integrationType={integrationType}
                setIntegrationType={setIntegrationType}
                setShowLoader={setShowLoader}
                setLists={setLists}
                setShopifyStores={setShopifyStores}
                redirectedType={redirectedType}
                setShowAddStore={setShowAddStore}
            />
            {(integrationType === "mailchimp" && isEmpty(lists)) &&
                <MailchimpIntegration
                    connectionError={connectionError}
                    integrationType={integrationType}
                    editID={editID}
                />
            }
            {( (integrationType === "shopify" && isEmpty(shopifyStores)) || showAddStore ) &&
                <ShopifyIntegration
                    connectionError={connectionError}
                    integrationType={integrationType}
                    editID={editID}
                    showAddStore={showAddStore}
                    setShowAddStore={setShowAddStore}
                />
            }
            {   (integrationType === "mailchimp" && !isEmpty(lists)) ||
                (integrationType === "shopify" && !isEmpty(shopifyStores) && !showAddStore ) ?

                <form onSubmit={handleSubmit} className="link_form">
                    <div className="row">
                        <div className="col-12">

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

                            {!displayAllProducts &&
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
                                            integrationType={integrationType}
                                            editID={editID}
                                            customIconArray={customIconArray}
                                            setCustomIconArray={setCustomIconArray}
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
                    }
                    <div className="row">
                        <div className="col-12">

                            {integrationType === "mailchimp" ?
                                <MailchimpLists
                                    lists={lists}
                                    setLists={setLists}
                                    currentLink={currentLink}
                                    setCurrentLink={setCurrentLink}
                                    /*inputKey={key}*/
                                    setIntegrationType={setIntegrationType}
                                />
                                :
                                ""
                            }

                            {integrationType === "shopify" &&
                                <div className="my_row products_wrap">
                                    {displayAllProducts ?
                                        <AllProducts
                                            selectedProducts={selectedProducts}
                                            setSelectedProducts={setSelectedProducts}
                                            allProducts={allProducts}
                                            setDisplayAllProducts={setDisplayAllProducts}
                                            /*handleChange={handleChange}*/
                                            setCurrentLink={setCurrentLink}
                                            /*inputKey={key}*/
                                            name={name}
                                        />

                                        :
                                        <>
                                            <StoreDropdown
                                                currentLink={currentLink}
                                                setCurrentLink={setCurrentLink}
                                                setSelectedProducts={setSelectedProducts}
                                                setShowAddStore={setShowAddStore}
                                                shopifyStores={shopifyStores}

                                            />
                                            <SelectedProducts
                                                currentLink={currentLink}
                                                setDisplayAllProducts={setDisplayAllProducts}
                                                setAllProducts={setAllProducts}
                                                setShowLoader={setShowLoader}
                                            />
                                        </>
                                    }
                                </div>
                            }
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
                :
                ""
            }

        </>
    );
};

export default IntegrationForm;
