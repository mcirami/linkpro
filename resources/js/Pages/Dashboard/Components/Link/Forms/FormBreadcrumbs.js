import React from 'react';
import {BiChevronLeft, BiChevronsLeft} from 'react-icons/bi';
import {MdDeleteForever} from 'react-icons/md';

const FormBreadcrumbs = ({
                             folderID,
                             setEditID,
                             setEditFolderID = false,
                             iconSelected,
                             setShowConfirmPopup = false,
                             setShowForm,
                             formType
}) => {

    const handleClick = (e) => {
        e.preventDefault();
        setShowForm({show: false, type: ""});
        setEditID(null);
        setEditFolderID ? setEditFolderID(false) : "";
    }

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
                           setShowForm ? setShowForm({show: false, type: ""}) : setEditID(null);
                       }}
                    >
                        <BiChevronLeft />
                        Folder
                    </a>
                    <a className="back" href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           setEditFolderID(false);
                           setShowForm ? setShowForm({show: false, type: ""}) : setEditID(null);
                       }}
                    >
                        <BiChevronsLeft />
                        Icons
                    </a>
                </>
                :
                <a className="back" href="#"
                   onClick={(e) => handleClick(e)}
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
