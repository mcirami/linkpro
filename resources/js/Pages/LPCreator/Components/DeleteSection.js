import React from 'react';
import {MdDeleteForever} from 'react-icons/md';
import {deleteSection} from '../../../Services/LandingPageRequests';

const DeleteSection = ({id, sections, setSections}) => {

    const handleDeleteClick = (e) => {
        e.preventDefault();

        deleteSection(id)
        .then((response) => {
            if(response.success) {
                setSections(
                    sections.filter((section) => {
                        return section.id !== id;
                    })
                )
            }
        })
    }

    return (
        <div className="delete_icon">
            <a className="delete" href="#"
               onClick={(e) => handleDeleteClick(e)}>
                <MdDeleteForever />
                <div className="hover_text delete_folder"><p>Delete Section</p></div>
            </a>
        </div>
    );
};

export default DeleteSection;
