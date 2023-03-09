import React from 'react';
import {BiChevronLeft, BiChevronsLeft} from 'react-icons/bi';
import {MdDeleteForever} from 'react-icons/md';

const FormBreadcrumbs = ({
                             folderID,
                             editID,
                             setEditID = false,
                             setEditFolderID = false,
                             iconSelected,
                             setShowConfirmPopup,
                             setShowLinkForm = false,
                             setIntegrationType = false,
                             setInputType = false,
}) => {

    const handleDeleteClick = e => {
        e.preventDefault();
        setShowConfirmPopup(true);
    }

    return (
        <>
            {folderID  ?
                <>
                    <a className="back" href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           {setShowLinkForm && setShowLinkForm(false)}
                           {setEditID && setEditID(null)}
                       }}
                    >
                        <BiChevronLeft />
                        Folder
                    </a>
                    <a className="back" href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           setEditFolderID(false);
                           {setShowLinkForm && setShowLinkForm(false)}
                           {setEditID && setEditID(null)}
                       }}
                    >
                        <BiChevronsLeft />
                        Icons
                    </a>
                </>
                :
                <a className="back" href="#"
                   onClick={(e) => {
                       e.preventDefault();
                       {setShowLinkForm && setShowLinkForm(false)}
                       {setEditID && setEditID(null)}
                       {setEditFolderID && setEditFolderID(false)}
                       {setIntegrationType && setIntegrationType(null)}
                       {setInputType && setInputType(null)}
                   }}
                >
                    <BiChevronLeft />
                    Back To Icons
                </a>
            }
            {/*{ (!iconSelected && editID) &&
                <div className="delete_icon">
                    <a className="delete" href="resources/js/Pages/Dashboard/Components/Link/Forms/FormBreadcrumbs#"
                       onClick={handleDeleteClick}>
                        <MdDeleteForever />
                    </a>
                    <div className="hover_text delete_folder"><p>Delete Icon</p></div>
                </div>
            }*/}

        </>
    );
};

export default FormBreadcrumbs;
