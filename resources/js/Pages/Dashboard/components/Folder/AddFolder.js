import { ImPlus } from "react-icons/im";
import addFolder from '../../../../Services/FolderRequests';
import React, {useContext} from 'react';
import {PageContext, UserLinksContext, OriginalArrayContext} from '../App';
import {updateContentHeight} from '../../../../Services/LinksRequest';

const AddFolder = ({userSub, setShowUpgradePopup, setOptionText }) => {

    const  { pageSettings } = useContext(PageContext);
    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const { originalArray, setOriginalArray } = useContext(OriginalArrayContext);

    const handleClick = (e) => {
        e.preventDefault();

        if ( (userSub && userSub["braintree_status"] === "active") || (userSub && userSub["braintree_status"] === "pending") || (userSub && new Date(userSub["ends_at"]).valueOf()) > new Date().valueOf() ) {

            const packets = {
                pageID: pageSettings["id"]
            }

            addFolder(packets)
            .then((data) => {

                if (data.success) {
                    let newLinks = [...userLinks];

                    const newFolderObject = {
                        id: data.id,
                        name: null,
                        type: 'folder',
                        position: data.position,
                        links: []
                    }

                    newLinks = newLinks.concat(newFolderObject);
                    setOriginalArray(newLinks);
                    setUserLinks(newLinks);

                    updateContentHeight(originalArray);
                }
            })

        } else {
            const popup = document.querySelector('#upgrade_popup');
            setShowUpgradePopup(true);
            popup.classList.add('open');
            setOptionText("add folders");

            setTimeout(() => {
                document.querySelector('#upgrade_popup .close_popup').addEventListener('click', function(e) {
                    e.preventDefault();
                    setShowUpgradePopup(false);
                    popup.classList.remove('open');
                });
            }, 500);
        }
    };

    return (

        <a href="" className="icon_wrap" onClick={handleClick}>
            <ImPlus />
            <h3>Add Folder</h3>
        </a>

    )
}
export default AddFolder;
