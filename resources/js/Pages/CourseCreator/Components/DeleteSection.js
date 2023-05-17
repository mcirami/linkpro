import React from 'react';
import {MdDeleteForever} from 'react-icons/md';
import {deleteSection} from '../../../Services/CourseRequests';

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
        <a className="button red float-end" href="#"
           onClick={(e) => handleDeleteClick(e)}>
            Delete Section
        </a>
    );
};

export default DeleteSection;
