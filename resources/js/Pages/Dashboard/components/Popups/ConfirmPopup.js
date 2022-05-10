import React, {useContext} from 'react';
import {MdCheckCircle} from 'react-icons/md';
import {
    deleteLink,
    updateContentHeight,
    updateLinkStatus,
} from '../../../../Services/LinksRequest';
import {UserLinksContext, OriginalArrayContext, FolderLinksContext, OriginalFolderLinksContext} from '../../App';

export const ConfirmPopup = ({
                                 editID,
                                 setEditID,
                                 showConfirmPopup,
                                 setShowConfirmPopup,
                                 folderID
                             }) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const { originalArray, setOriginalArray } = useContext(OriginalArrayContext);

    const { folderLinks, setFolderLinks } = useContext(FolderLinksContext);
    const { originalFolderLinks, setOriginalFolderLinks } = useContext(OriginalFolderLinksContext);

    const deleteItem = (e) => {
        e.preventDefault();

        let newFolderArray;
        /*let newOriginalFolderLinks = null;*/
        let newArray;
        let newOriginalArray;

        if (folderID) {
            newFolderArray = folderLinks.filter(element => element.id !== editID);
            /*newOriginalFolderLinks = originalFolderLinks.filter(element => element.id !== editID);*/
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
        }

        const packets = {
            userLinks: newArray,
            folderLinks: newFolderArray
        }

        deleteLink(packets, editID)
        .then((data) => {

            if(data.success) {

                if (folderID) {

                    const newFolderLinks = data.links.find(el => el.id === folderID);
                    setOriginalFolderLinks(newFolderLinks.links);
                    setFolderLinks(newFolderLinks.links);

                    let folderActive = null;
                    if (newFolderArray.length === 0) {

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
                    setOriginalArray(data.links)
                    setUserLinks(data.links);
                }


                setEditID(null)
                updateContentHeight();
                setShowConfirmPopup(false)
            }
        })
    }

    const handleCancel = e => {
        e.preventDefault();
        setShowConfirmPopup(false)
    }

    return (

        <div id="confirm_popup_link" className={showConfirmPopup ? 'open' : "" }>
            <div className="box">
                <div className="icon_wrap check">
                    <MdCheckCircle/>
                </div>
                <h2>Confirm</h2>
                <div className="text_wrap">
                    <p className="confirm_text">Are you sure you want to delete this icon?</p>
                    <form action="resources/js/Pages/Dashboard/ConfirmPopup" className="button_row">
                        <a className="button green" href="resources/js/Pages/Dashboard/ConfirmPopup#" onClick={deleteItem}>Yes</a>
                        <a className="button transparent gray" href="resources/js/Pages/Dashboard/ConfirmPopup#" onClick={handleCancel}>No</a>
                    </form>
                </div>
            </div>
        </div>

    )
}
