import React, {useContext} from 'react';
import {MdCheckCircle} from 'react-icons/md';
import {deleteLink} from '../../../Services/LinksRequest';
import {UserLinksContext, OriginalArrayContext} from './App';

export const ConfirmPopup = ({
                                 editID,
                                 setEditID,
                                 setShowConfirmPopup,
                                 folderLinks,
                                 setFolderLinks,
                                 originalFolderLinks,
                                 setOriginalFolderLinks,
                                 folderID
                             }) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const { originalArray, setOriginalArray } = useContext(OriginalArrayContext);

    const deleteItem = (e) => {
        e.preventDefault();

        let newFolderArray = null;
        let newArray = null;
        if (folderID) {
            newFolderArray = folderLinks.filter(element => element.id !== editID);
        } else {
            newArray = userLinks.filter(element => element.id !== editID)
        }

        const packets = {
            userLinks: newArray,
            folderLinks: newFolderArray
        }

        deleteLink(packets, editID)
        .then((data) => {

            if(data.success) {

                if (newFolderArray) {
                    setOriginalFolderLinks(
                        newFolderArray.map((link, index) => ({...link, position: index}))
                    )
                    setFolderLinks(
                        newFolderArray.map((link, index) => ({...link, position: index}))
                    )
                    newArray = userLinks.map((item) => {
                        if (item.id === folderID) {
                            //const itemLinks = item.links.concat(newLinkObject)
                            item.links = item.links.map((link, index) => {
                                return {
                                    ...link,
                                    position: index
                                }
                            })

                            return item;
                        }

                        return item;
                    })

                    setOriginalArray(newArray);
                    setUserLinks(newArray);

                } else {
                    setOriginalArray(
                        newArray.map((link, index) => ({...link, position: index}))
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

        if ((originalArray.length - 1) % 4 === 0 ) {
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
