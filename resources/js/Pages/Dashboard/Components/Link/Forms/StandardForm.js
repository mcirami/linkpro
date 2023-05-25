import React, {useCallback, useEffect, useState, useContext} from 'react';
import IconList from '../IconList';
import InputComponent from './InputComponent';
import InputTypeRadio from './InputTypeRadio';
import {
    addLink,
    checkURL,
    updateLink,
    updateLinkStatus,
} from '../../../../../Services/LinksRequest';
import {
    FOLDER_LINKS_ACTIONS,
    LINKS_ACTIONS,
    ORIG_FOLDER_LINKS_ACTIONS,
    ORIGINAL_LINKS_ACTIONS,
} from '../../../../../Services/Reducer';
import {
    FolderLinksContext,
    OriginalArrayContext,
    OriginalFolderLinksContext,
    PageContext,
    UserLinksContext,
} from '../../../App';

const StandardForm = ({
                          accordionValue,
                          setAccordionValue,
                          inputType,
                          setInputType,
                          editID,
                          subStatus,
                          setShowLinkForm,
                          setEditID,
                          setShowUpgradePopup,
                          setOptionText,
                          folderID,
                          affStatus = null,

}) => {

    const { userLinks, dispatch } = useContext(UserLinksContext);
    const { originalArray, dispatchOrig } = useContext(OriginalArrayContext);
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    const { originalFolderLinks, dispatchOrigFolderLinks } = useContext(OriginalFolderLinksContext);
    const  { pageSettings } = useContext(PageContext);

    const [currentLink, setCurrentLink] = useState(
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

    const [charactersLeft, setCharactersLeft] = useState();

    useEffect(() => {
        if(currentLink.name) {
            setCharactersLeft(11 - currentLink.name.length);
        } else {
            setCharactersLeft(11);
        }

    },[charactersLeft])

    useEffect(() => {

        if(accordionValue === "standard") {
            if (currentLink.phone) {
                setInputType("phone")
            } else if (currentLink.email) {
                setInputType("email")
            } else {
                setInputType("url")
            }
        } else if (accordionValue === "offer") {
            setInputType("offer")
        }

    },[])

    const handleLinkName = useCallback( (e) => {
            let value = e.target.value;

            setCharactersLeft(11 - value.length);

            setCurrentLink(() => ({
                ...currentLink,
                name: value
            }))
        });

    const handleOnClick = e => {

        if (!subStatus) {
            setShowUpgradePopup(true);
            setOptionText("change link name");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let URL = currentLink.url;
        let data;

        if (URL && currentLink.name) {
            data = checkURL(URL, currentLink.name, null, !subStatus);
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
                        type: "url",
                    };
                    break;
                case "email":
                    packets = {
                        name: currentLink.name,
                        email: currentLink.email,
                        icon: currentLink.icon,
                        page_id: pageSettings["id"],
                        folder_id: folderID,
                        type: "email",
                    };
                    break;
                case "phone":
                    packets = {
                        name: currentLink.name,
                        phone: currentLink.phone,
                        icon: currentLink.icon,
                        page_id: pageSettings["id"],
                        folder_id: folderID,
                        type: "phone",
                    };
                    break;
                case "offer":
                    packets = {
                        name: currentLink.name,
                        icon: currentLink.icon,
                        url: URL,
                        page_id: pageSettings["id"],
                        folder_id: folderID,
                        type: "offer",
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

                    setAccordionValue(null);
                    setShowLinkForm(false);
                    setInputType(null);
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
    };

    const handleCancel = (e) => {
        e.preventDefault();
        setEditID(null);
        setShowLinkForm(false);
        setInputType(null);
        setAccordionValue(null);
        document.getElementById(
            'left_col_wrap').style.minHeight = "unset";
    }

    return (
        <>
        { accordionValue === "offer" && (affStatus !== "approved" || !affStatus) ?

            <div className="info_message">
                <p>Sign up now to become an affiliate and earn money selling courses!</p>
                <a className="button blue" target="_blank" href="/affiliate-sign-up">Click Here To Get Approved</a>
            </div>

            :

            <form onSubmit={handleSubmit} className="link_form">
                <div className="row">
                    <div className="col-12">

                        <div className="icon_row">
                            <div className="icon_box">
                                <IconList
                                    currentLink={currentLink}
                                    setCurrentLink={setCurrentLink}
                                    accordionValue={accordionValue}
                                    setCharactersLeft={setCharactersLeft}
                                    inputType={inputType}
                                    setInputType={setInputType}
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

                {accordionValue !== "offer" &&
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
                }

                <div className="row">
                    <div className="col-12">

                        {accordionValue === "offer" ?
                            <div className="my_row external_link">
                                <h3>Offer Landing Page:</h3>
                                {currentLink.url ?
                                    <a href={currentLink.url.split(
                                        "?")[0]} target="_blank">{currentLink.url.split(
                                        "?")[0]}</a>
                                    :
                                    <p>Select An Icon Above</p>
                                }
                            </div>
                            :
                            <InputComponent
                                inputType={inputType}
                                setInputType={setInputType}
                                currentLink={currentLink}
                                setCurrentLink={setCurrentLink}
                            />
                        }


                    </div>
                </div>

                <div className="row">
                    <div className="col-12 button_row">
                        <button className="button green" type="submit">
                            Save
                        </button>
                        <a href="#" className="button transparent gray" onClick={(e) => handleCancel(
                            e)}>
                            Cancel
                        </a>
                        <a className="help_link" href="mailto:help@link.pro">Need Help?</a>
                    </div>
                </div>

            </form>
        }
        </>
    );
};

export default StandardForm;
