import React from 'react';
import {BiChevronLeft, BiChevronsLeft} from 'react-icons/bi';
import {MdDeleteForever} from 'react-icons/md';

const FormBreadcrumbs = ({
                             folderID,
                             editID,
                             setEditID,
                             setEditFolderID,
                             iconSelected,
                             setShowConfirmPopup,
                             setAccordionValue,
                             showLinkForm,
                             setShowLinkForm,
                             setIntegrationType,
                             setInputType
}) => {

    /*const handleDeleteClick = e => {
        e.preventDefault();
        setShowConfirmPopup(true);
    }*/

    return (
        <>
            {folderID  ?
                <>
                    {editID || showLinkForm ?
                        <a className="back" href="#"
                           onClick={(e) => {
                               e.preventDefault();
                               setShowLinkForm(false)
                               setEditID(null)
                               setAccordionValue(null);
                           }}
                        >
                            <BiChevronLeft />
                            Folder
                        </a>
                        :
                        ""
                    }
                    <a className="back" href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           setEditFolderID(false);
                           setShowLinkForm(false);
                           setEditID(null);
                           setAccordionValue(null);
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
                       setShowLinkForm(false)
                       setEditID(null)
                       setEditFolderID(false)
                       setIntegrationType(null)
                       setInputType(null)
                       setAccordionValue(null);
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
