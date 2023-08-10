import React from 'react';
import {BiChevronLeft, BiChevronsLeft} from 'react-icons/bi';
import {MdDeleteForever} from 'react-icons/md';

const FormBreadcrumbs = ({
                             folderID,
                             editID,
                             setEditID,
                             setEditFolderID,
                             setAccordionValue,
                             showLinkForm,
                             setShowLinkForm,
                             setIntegrationType,
                             setInputType
}) => {

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
        </>
    );
};

export default FormBreadcrumbs;
