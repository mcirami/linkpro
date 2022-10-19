import React from 'react';
import FormBreadcrumbs from '../Link/Forms/FormBreadcrumbs';
import {MdDeleteForever} from 'react-icons/md';
import FolderNameInput from './FolderNameInput';
import AddLink from '../Link/AddLink';

const FolderHeading = ({
                           subStatus,
                           setShowUpgradePopup,
                           setOptionText,
                           setEditFolderID,
                           setShowNewForm,
                           setShowConfirmFolderDelete,
                           editFolderID,
                           setRadioValue
                       }) => {

    const handleDeleteFolder = e => {

        e.preventDefault();
        setShowConfirmFolderDelete(true);
    }

    return (
        <div>
            <div className="my_row icon_breadcrumb" id="scrollTo">
                <p>Editing Folder</p>
                <div className="breadcrumb_links">
                    <FormBreadcrumbs
                        setEditFolderID={setEditFolderID}
                        formType={"none"}
                    />
                    <div className="delete_icon">
                        <a className="delete" href="#" onClick={handleDeleteFolder}><MdDeleteForever/></a>
                        <div className="hover_text delete_folder">
                            <p>Delete Folder</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="folder_name my_row">
                <FolderNameInput
                    folderID={editFolderID}
                />
            </div>
            <div className="my_row link_row folders">

                <div className="add_more_icons">
                    <AddLink
                        subStatus={subStatus}
                        setShowNewForm={setShowNewForm}
                        setShowUpgradePopup={setShowUpgradePopup}
                        setOptionText={setOptionText}
                        setRadioValue={setRadioValue}
                    />
                </div>
            </div>
        </div>
    );
};

export default FolderHeading;
