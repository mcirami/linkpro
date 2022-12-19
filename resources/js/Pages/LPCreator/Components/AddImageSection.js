import React from 'react';
import { ImPlus } from "react-icons/im";

const AddImageSection = ({sections, setSections}) => {

    const handleOnClick = (e) => {
        e.preventDefault();
        const object = {
            id: sections.length + 1,
            type: 'image',
            bgColor: null,
            textColor: null,
            text: null,
            imgUrl: Vapor.asset("images/top-circle-image.jpg"),
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
            <h3>Add Image Section</h3>
        </a>
    );
};

export default AddImageSection;
