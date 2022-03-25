import { ImPlus } from "react-icons/im";
import addFolder from '../../../../Services/FolderRequests';
import React, {useContext} from 'react';

import {
    PageContext,
    UserLinksContext,
    OriginalArrayContext,
    FolderLinksContext, OriginalFolderLinksContext,
} from '../App';

const AddFolder = ({
                       setShowUpgradePopup,
                       setOptionText,
                       setEditFolderID,
                       subStatus
}) => {

    const  { pageSettings } = useContext(PageContext);
    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const { originalArray, setOriginalArray } = useContext(OriginalArrayContext);
    const { folderLinks, setFolderLinks } = useContext(FolderLinksContext);
    const { originalFolderLinks, setOriginalFolderLinks } = useContext(OriginalFolderLinksContext);

    const handleClick = (e) => {
        e.preventDefault();

        if ( subStatus ) {

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

    const fetchFolderLinks = async (folderID) => {
        const url = 'folder/links/' + folderID;
        const response = await fetch(url);
        const folderLinks = await response.json();

        setOriginalFolderLinks(folderLinks["links"]);
        setFolderLinks(folderLinks["links"]);
        setEditFolderID(folderID);

        setTimeout(function(){
            document.querySelector('#scrollTo').scrollIntoView({
                behavior: 'smooth',
                block: "start",
                inline: "nearest"
            });

        }, 800)
    }

    return (

        <a href="" className="icon_wrap" onClick={handleClick}>
            <ImPlus />
            <h3>Add Folder</h3>
        </a>

    )
}
export default AddFolder;
