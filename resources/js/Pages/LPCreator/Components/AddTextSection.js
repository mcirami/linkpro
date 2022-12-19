import React from 'react';
import { ImPlus } from "react-icons/im";

const AddTextSection = ({sections, setSections}) => {

    const handleOnClick = (e) => {
        e.preventDefault();

        const object = {
            id: sections.length + 1,
            type: 'text',
            bgColor: 'rgba(255,255,255,1)',
            textColor: 'rgba(0,0,0,1)',
            text: "Sample Text",
            imgUrl: null,
            includeButton: false,
            buttonPosition: null
        }

        setSections([
            ...sections,
            object
        ])
    }

    return (
        <a className="icon_wrap" href="#" onClick={(e) => handleOnClick(e)}>
            <ImPlus />
            <h3>Add Text Section</h3>
        </a>
    );
};

export default AddTextSection;
