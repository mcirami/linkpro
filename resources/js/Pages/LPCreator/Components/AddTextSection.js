import React from 'react';
import { ImPlus } from "react-icons/im";
import {addSection} from '../../../Services/LandingPageRequests';

const AddTextSection = ({sections, setSections, pageID}) => {

    const handleOnClick = (e) => {
        e.preventDefault();

        const packets = {
            type: "text"
        }

        addSection(packets, pageID)
        .then((response) => {
            if (response.success) {
                console.log(response.section)
                setSections([
                    ...sections,
                    response.section
                ])
            }
        })

       /* const object = {
            id: sections.length + 1,
            type: 'text',
            bgColor: 'rgba(255,255,255,1)',
            textColor: 'rgba(0,0,0,1)',
            text: "",
            imgUrl: null,
            includeButton: false,
            buttonPosition: null
        }*/


    }

    return (
        <a className="icon_wrap" href="#" onClick={(e) => handleOnClick(e)}>
            <ImPlus />
            <h3>Add Text Section</h3>
        </a>
    );
};

export default AddTextSection;
