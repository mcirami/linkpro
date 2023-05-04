import React from 'react';
import { ImPlus } from "react-icons/im";
import {addSection} from '../../../Services/LandingPageRequests';

const AddImageSection = ({sections, setSections, pageID}) => {

    const handleOnClick = (e) => {
        e.preventDefault();

        const packets = {
            type: "image"
        }

        addSection(packets, pageID)
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
            <h3>Add Image Section</h3>
        </a>
    );
};

export default AddImageSection;
