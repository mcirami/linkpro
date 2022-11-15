import React, {useContext} from 'react';
import {MdCheckCircle} from 'react-icons/md';
import {
    deleteLink,
    updateContentHeight,
    updateLinkStatus,
} from '../../../../Services/LinksRequest';
import {UserLinksContext, OriginalArrayContext, FolderLinksContext, OriginalFolderLinksContext} from '../../App';
import {
    LINKS_ACTIONS,
    ORIGINAL_LINKS_ACTIONS,
    FOLDER_LINKS_ACTIONS,
    ORIG_FOLDER_LINKS_ACTIONS
} from '../../../../Services/Reducer';

export const ConfirmPopup = ({
                                 editID,
                                 setEditID,
                                 showConfirmPopup,
                                 setShowConfirmPopup,
                                 folderID,
                                 iconsWrapRef,
                                 setInputType,
                                 setIntegrationType

                             }) => {

    const { userLinks, dispatch  } = useContext(UserLinksContext);
    const { originalArray, dispatchOrig } = useContext(OriginalArrayContext);
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    const { dispatchOrigFolderLinks } = useContext(OriginalFolderLinksContext);


    const deleteItem = (e) => {
        e.preventDefault();

        let newFolderArray;
        let newArray;
        let newOriginalArray;

        if (folderID) {
            newFolderArray = folderLinks.filter(element => element.id !== editID);
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
            /*newOriginalArray = originalArray.map((item) => {
                if (item.id === folderID && item.type === "folder") {
                    const itemLinks = item.links.filter(element => element.id !== editID)

                    return {
                        ...item,
                        links: itemLinks
                    }
                }
                return item;
            });*/
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

                    dispatchOrigFolderLinks({ type: ORIG_FOLDER_LINKS_ACTIONS.SET_ORIG_FOLDER_LINKS, payload: {links: newFolderLinks.links} })
                    dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS, payload: {links: newFolderLinks.links} })

                    let folderActive = null;
                    if (newFolderArray.length === 0) {

                        folderActive = false;
                        const url = "/dashboard/folder/status/";
                        const packets = {
                            active_status: folderActive,
                        };

                        updateLinkStatus(packets, folderID, url);
                    }

                    dispatchOrig({ type: ORIGINAL_LINKS_ACTIONS.UPDATE_LINKS_POSITIONS, payload: {links: newArray, folderActive: folderActive, folderID: folderID} })
                    dispatch({ type: LINKS_ACTIONS.UPDATE_LINKS_POSITIONS, payload: {links: newArray, folderActive: folderActive, folderID: folderID} })

                } else {
                    dispatchOrig({ type: ORIGINAL_LINKS_ACTIONS.SET_ORIGINAL_LINKS, payload: {links: data.links}})
                    dispatch({ type: LINKS_ACTIONS.SET_LINKS, payload: {links: data.links} })
                }

                setEditID(null)
                updateContentHeight(iconsWrapRef, folderID && true);
                setShowConfirmPopup(false)
                setIntegrationType(null);
                setInputType(null)
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
