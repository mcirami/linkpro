import React from 'react';
import { ImPlus } from "react-icons/im";
import {addSection} from '../../../Services/CourseRequests';

const AddVideoSection = ({
                             sections,
                             setSections,
                             courseID,
                             setOpenIndex
}) => {

    const handleOnClick = (e) => {
        e.preventDefault();

        const packets = {
            type: "video"
        }

        addSection(packets, courseID)
        .then((response) => {

            if (response.success) {
                setSections([
                    ...sections,
                    response.section
                ])

                const newIndex = sections.length;
                setOpenIndex(prev => ([
                    ...prev,
                    newIndex
                ]))
                setTimeout(function(){
                    document.querySelector('.sections_wrap .section_row:last-child').scrollIntoView({
                        behavior: 'smooth',
                        block: "start",
                        inline: "nearest"
                    });

                }, 800)
            }
        })
    }

    return (
        <a className="icon_wrap" href="#" onClick={(e) => handleOnClick(e)}>
            <ImPlus />
            <h3>Add Video Section</h3>
        </a>
    );
};

export default AddVideoSection;
