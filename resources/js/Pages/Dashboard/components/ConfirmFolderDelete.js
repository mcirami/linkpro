import React, {useContext} from 'react';
import {MdCheckCircle} from 'react-icons/md';
import {deleteFolder} from '../../../Services/FolderRequests';
import {updateContentHeight} from '../../../Services/LinksRequest';
import {UserLinksContext, OriginalArrayContext} from './App';

export const ConfirmFolderDelete = ({
                                        showConfirmFolderDelete,
                                        setShowConfirmFolderDelete,
                                        folderID,
                                        setEditFolderID
                             }) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const { originalArray, setOriginalArray } = useContext(OriginalArrayContext);

    const deleteItem = (e) => {
        e.preventDefault();


        let newArray = userLinks.filter(element => {

            if (element.type !== "folder") {
                return element
            } else {
                return element.id !== folderID
            }

        });
        /*let newOriginalArray = originalArray.filter(element => {
            if (element.type !== "folder") {
                return element
            } else {
                return element.id !== folderID
            }
        });*/

        const packets = {
            userLinks: newArray,
        }

        deleteFolder(packets, folderID)
        .then((data) => {

            if(data.success) {

                setOriginalArray(data.links)

                setUserLinks(data.links)

                setEditFolderID(null);
                updateContentHeight();
                setShowConfirmFolderDelete(false);
                //document.querySelector('#confirm_folder_popup_link').classList.remove('open');
            }
        })
    }

    const handleCancel = e => {
        e.preventDefault();
        setShowConfirmFolderDelete(false)
        //document.querySelector('#confirm_folder_popup_link').classList.remove('open');
    }

    /*const updateContentHeight = () => {

        if ( originalArray.length - 1 > 0 && (originalArray.length - 1) % 4 === 0 ) {
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
    }*/

    return (

        <div id="confirm_folder_popup_link" className={showConfirmFolderDelete ? "open" : ""}>
            <div className="box">
                <div className="icon_wrap check">
                    <MdCheckCircle/>
                </div>
                <h2>Confirm</h2>
                <div className="text_wrap">
                    <p className="confirm_text">Are you sure you want to delete this folder?</p>
                    <form action="" className="button_row">
                        <a className="button green" href="#" onClick={deleteItem}>Yes</a>
                        <a className="button transparent gray" href="#" onClick={handleCancel}>No</a>
                    </form>
                </div>
            </div>
        </div>

    )
}
