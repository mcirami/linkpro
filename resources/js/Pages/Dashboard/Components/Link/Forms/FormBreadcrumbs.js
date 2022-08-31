import React from 'react';
import {BiChevronLeft, BiChevronsLeft} from 'react-icons/bi';
import {MdDeleteForever} from 'react-icons/md';

const FormBreadcrumbs = ({
                             folderID,
                             setEditID = false,
                             setEditFolderID = false,
                             iconSelected,
                             setShowConfirmPopup = false,
                             setShowNewForm = false,
                             formType
}) => {

    const handleDeleteClick = e => {
        e.preventDefault();
        setShowConfirmPopup(true);
    }

    return (
        <div className="breadcrumb_links">
            {folderID  ?
                <>
                    <a className="back" href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           setShowNewForm ? setShowNewForm(false) : setEditID(null);
                       }}
                    >
                        <BiChevronLeft />
                        Folder
                    </a>
                    <a className="back" href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           setEditFolderID(false);
                           setShowNewForm ? setShowNewForm(false) : setEditID(null);
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
                       setShowNewForm ? setShowNewForm(false) : "";
                       setEditID ? setEditID(null) : "";
                       setEditFolderID ? setEditFolderID(false) : "";
                   }}
                >
                    <BiChevronLeft />
                    Back To Icons
                </a>
            }
            { (!iconSelected && formType === "edit") &&
                <div className="delete_icon">
                    <a className="delete" href="resources/js/Pages/Dashboard/Components/Link/Forms/FormBreadcrumbs#" onClick={handleDeleteClick}><MdDeleteForever /></a>
                    <div className="hover_text delete_folder"><p>Delete Icon</p></div>
                </div>
            }

        </div>
    );
};

export default FormBreadcrumbs;
