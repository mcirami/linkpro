import React from 'react';
import AddLink from './AddLink';
import AddFolder from '../Folder/AddFolder';
import FolderHeading from '../Folder/FolderHeading';

const LinkSectionHeading = ({editFolderID, editID}) => {

    return (
        <div className="my_row link_row">
            <div className="add_more_link">

                {!editID && !editFolderID ?
                    <>
                        <AddLink
                            setShowLinkForm={setShowLinkForm}
                            subStatus={subStatus}
                            setShowUpgradePopup={setShowUpgradePopup}
                            setOptionText={setOptionText}
                            setRadioValue={setRadioValue}
                        />
                        <AddFolder
                            subStatus={subStatus}
                            setShowUpgradePopup={setShowUpgradePopup}
                            setOptionText={setOptionText}
                            setEditFolderID={setEditFolderID}
                        />
                    </>
                    :
                    editFolderID && !editID ?
                        <AddLink
                            setShowLinkForm={setShowLinkForm}
                            subStatus={subStatus}
                            setShowUpgradePopup={setShowUpgradePopup}
                            setOptionText={setOptionText}
                            setRadioValue={setRadioValue}
                        />
                        :
                        ""
                }
            </div>
        </div>
    );
};

export default LinkSectionHeading;
