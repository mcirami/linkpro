import React, {useContext} from 'react';
import {MdCheckCircle} from 'react-icons/md';
import {deleteFolder} from '../../../../Services/FolderRequests';
import {updateContentHeight} from '../../../../Services/LinksRequest';
import {UserLinksContext, OriginalArrayContext} from '../../App';
import {
    LINKS_ACTIONS,
    ORIGINAL_LINKS_ACTIONS,
} from '../../../../Services/Reducer';


export const ConfirmFolderDelete = ({
                                        showConfirmFolderDelete,
                                        setShowConfirmFolderDelete,
                                        folderID,
                                        setEditFolderID
                             }) => {

    const { userLinks, dispatch  } = useContext(UserLinksContext);
    const { dispatchOrig } = useContext(OriginalArrayContext);

    const deleteItem = (e) => {
        e.preventDefault();


        let newArray = userLinks.filter(element => {

            if (element.type !== "folder") {
                return element
            } else {
                return element.id !== folderID
            }

        });

        const packets = {
            userLinks: newArray,
        }

        deleteFolder(packets, folderID)
        .then((data) => {

            if(data.success) {

                dispatchOrig({ type: ORIGINAL_LINKS_ACTIONS.SET_ORIGINAL_LINKS, payload: {links: data.links} })
                dispatch({ type: LINKS_ACTIONS.SET_LINKS, payload: {links: data.links} })

                setEditFolderID(null);
                updateContentHeight();
                setShowConfirmFolderDelete(false);
            }
        })
    }

    const handleCancel = e => {
        e.preventDefault();
        setShowConfirmFolderDelete(false)
    }

    return (

        <div id="confirm_folder_popup_link" className={showConfirmFolderDelete ? "open" : ""}>
            <div className="box">
                <div className="icon_wrap check">
                    <MdCheckCircle/>
                </div>
                <h2>Confirm</h2>
                <div className="text_wrap">
                    <p className="confirm_text">Are you sure you want to delete this folder?</p>
                    <form action="resources/js/Pages/Dashboard/ConfirmFolderDelete" className="button_row">
                        <a className="button green" href="resources/js/Pages/Dashboard/ConfirmFolderDelete#" onClick={deleteItem}>Yes</a>
                        <a className="button transparent gray" href="resources/js/Pages/Dashboard/ConfirmFolderDelete#" onClick={handleCancel}>No</a>
                    </form>
                </div>
            </div>
        </div>

    )
}
