import React from 'react';
import { ImPlus } from "react-icons/im";
import {addSection} from '../../../Services/CourseRequests';

const AddTextSection = ({sections, setSections, courseID}) => {

    const handleOnClick = (e) => {
        e.preventDefault();

        const packets = {
            type: "text"
        }

        addSection(packets, courseID)
        .then((response) => {
            if (response.success) {
                setSections([
                    ...sections,
                    response.section
                ])
            }
        })
    }

    return (
        <a className="icon_wrap" href="#" onClick={(e) => handleOnClick(e)}>
            <ImPlus />
            <h3>Add Text Section</h3>
        </a>
    );
};

export default AddTextSection;