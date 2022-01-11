import { ImPlus } from "react-icons/im";
import addFolder from '../../../../Services/FolderRequests';
import React, {useContext} from 'react';
import {PageContext, UserLinksContext, OriginalArrayContext} from '../App';
import {updateContentHeight} from '../../../../Services/LinksRequest';

const AddFolder = ({
                       userSub,
                       setShowUpgradePopup,
                       setOptionText,
                       setEditFolderID,
                       setFolderLinks,
                       setOriginalFolderLinks }) => {

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
                    let newOriginalArray = [...originalArray];
                    const newFolderObject = {
                        id: data.id,
                        name: null,
                        type: 'folder',
                        position: data.position,
                        links: []
                    }
                    setOriginalArray(newOriginalArray.concat(newFolderObject));
                    setUserLinks(newLinks.concat(newFolderObject));

                    //updateContentHeight(originalArray);

                    //setEditFolderID(data.id);

                    fetchFolderLinks(data.id);
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

    const fetchFolderLinks = async (linkID) => {
        const url = 'folder/links/' + linkID;
        const response = await fetch(url);
        const folderLinks = await response.json();

        setOriginalFolderLinks(folderLinks["links"]);
        setFolderLinks(folderLinks["links"]);
        setEditFolderID(linkID)

    }

    return (

        <a href="" className="icon_wrap" onClick={handleClick}>
            <ImPlus />
            <h3>Add Folder</h3>
        </a>

    )
}
export default AddFolder;
