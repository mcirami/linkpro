import React, {useContext} from 'react';
import {MdCheckCircle} from 'react-icons/md';
import {deleteLink, updateLinkStatus} from '../../../Services/LinksRequest';
import {UserLinksContext, OriginalArrayContext} from './App';
import {element} from 'prop-types';

export const ConfirmPopup = ({
                                 editID,
                                 setEditID,
                                 setShowConfirmPopup,
                                 folderLinks,
                                 setFolderLinks,
                                 originalFolderLinks,
                                 setOriginalFolderLinks,
                                 folderID,
                                 arrayIndex
                             }) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const { originalArray, setOriginalArray } = useContext(OriginalArrayContext);

    const deleteItem = (e) => {
        e.preventDefault();

        let newArray = null;
        let newOriginalArray = null;

        if (folderID) {

            newArray = userLinks.map((item) => {
                if (item.id === folderID && item.type === "folder") {
                    const itemLinks = item.links.filter(element => element.id !== editID)

                    return {
                        ...item,
                        links: itemLinks
                    }
                }
                return item;
            });
            newOriginalArray = originalArray.map((item) => {
                if (item.id === folderID && item.type === "folder") {
                    const itemLinks = item.links.filter(element => element.id !== editID)

                    return {
                        ...item,
                        links: itemLinks
                    }
                }
                return item;
            });
        } else {
            newArray = userLinks.filter(element => element.id !== editID);
            newOriginalArray = originalArray.filter(element => element.id !== editID);
        }

        const packets = {
            userLinks: newArray,
        }

        deleteLink(packets, editID)
        .then((data) => {

            if(data.success) {

                if (folderID) {

                    let folderActive = null;
                    if (userLinks[arrayIndex].links.length === 1) {

                        folderActive = false;
                        const url = "/dashboard/folder/status/";
                        const packets = {
                            active_status: folderActive,
                        };

                        updateLinkStatus(packets, folderID, url);
                    }

                    setOriginalArray(
                        newOriginalArray.map((item) => {
                            if (item.id === folderID && item.type === "folder") {
                                //const itemLinks = item.links.concat(newLinkObject)
                                const newOrder = item.links.map((link, index) => {
                                    return {
                                        ...link,
                                        position: index
                                    }
                                })

                                return {
                                    ...item,
                                    active_status: folderActive !== null ? folderActive : item.active_status,
                                    links: newOrder
                                }
                            }

                            return item;
                        })
                    )

                    setUserLinks(
                        newArray.map((item) => {
                            if (item.id === folderID && item.type === "folder") {
                                //const itemLinks = item.links.concat(newLinkObject)
                                const newOrder = item.links.map((link, index) => {
                                    return {
                                        ...link,
                                        position: index
                                    }
                                })

                                return {
                                    ...item,
                                    active_status: folderActive === false ? folderActive : item.active_status,
                                    links: newOrder
                                }
                            }

                            return item;
                        })
                    )

                } else {
                    setOriginalArray(
                        newOriginalArray.map((link, index) => ({...link, position: index}))
                    )

                    setUserLinks(
                        newArray.map((link, index) => ({...link, position: index}))
                    )
                }


                setEditID(null)
                updateContentHeight();
                setShowConfirmPopup(false)
                document.querySelector('#confirm_popup_link').classList.remove('open');
            }
        })
    }

    const handleCancel = e => {
        e.preventDefault();
        setShowConfirmPopup(false)
        document.querySelector('#confirm_popup_link').classList.remove('open');
    }

    const updateContentHeight = () => {

        if (folderID && (userLinks[arrayIndex].links.length - 1 > 0) && ( (userLinks[arrayIndex].links.length - 1) % 4 === 0) )  {
            const iconsWrap = document.querySelector('.icons_wrap');
            const icons = document.querySelectorAll('.add_icons .icon_col');
            const colHeight = icons[0].clientHeight;
            const rowCount = Math.ceil(icons.length / 4);
            let divHeight = rowCount * colHeight - 40;

            if (originalArray.length - 1 < 5) {
                divHeight += 20;
            }

            iconsWrap.style.minHeight = divHeight + "px";

        } else if ( !folderID && (originalArray.length - 1 > 0) && ((originalArray.length - 1) % 4 === 0) ) {
            const iconsWrap = document.querySelector('.icons_wrap');
            const icons = document.querySelectorAll('.add_icons .icon_col');
            const colHeight = icons[0].clientHeight;
            const rowCount = Math.ceil(icons.length / 4);
            let divHeight = rowCount * colHeight - 40;

            if (originalArray.length - 1 < 5) {
                divHeight += 20;
            }

            iconsWrap.style.minHeight = divHeight + "px";
        }


    }

    return (

        <>
            <div className="box">
                <div className="icon_wrap check">
                    <MdCheckCircle/>
                </div>
                <h2>Confirm</h2>
                <div className="text_wrap">
                    <p className="confirm_text">Are you sure you want to delete this icon?</p>
                    <form action="" className="button_row">
                        <a className="button green" href="#" onClick={deleteItem}>Yes</a>
                        <a className="button transparent gray" href="#" onClick={handleCancel}>No</a>
                    </form>
                </div>
            </div>
        </>

    )
}
