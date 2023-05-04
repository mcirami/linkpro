import React from 'react';
import {MdDeleteForever} from 'react-icons/md';

const DeleteIcon = ({
                        setShowConfirmPopup,
                        setShowConfirmFolderDelete,
                        editFolderID,
                        editID
}) => {

    const handleDeleteClick = e => {
        e.preventDefault();
        if(editFolderID && !editID) {
            setShowConfirmFolderDelete(true);
        } else {
            setShowConfirmPopup(true);
        }
    }

    return (
        <>
            <a className="delete" href="#"
               onClick={handleDeleteClick}>
                <MdDeleteForever />
            </a>
            <div className="hover_text delete_folder"><p>Delete {editID ? "Icon" : "Folder"}</p></div>
        </>
    );
};

export default DeleteIcon;
