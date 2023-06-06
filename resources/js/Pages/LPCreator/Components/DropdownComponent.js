import React, {useEffect, useRef} from 'react';
import {updateSectionData} from '../../../Services/LandingPageRequests';
import {HandleFocus} from '../../../Utils/InputAnimations';

const DropdownComponent = ({
                               courses,
                               button_link,
                               sections,
                               setSections,
                               id,
                               url
}) => {

    const handleChange = (e) => {

        if (e.target.value === "") {
            e.target.classList.remove('active');
        }

        const value = e.target.value;
        const packets = {
            button_link: value
        }

        updateSectionData(packets, id)
        .then((response) => {

            if(response.success) {
                setSections(
                    sections.map((section) => {
                        if(section.id === id) {
                            section.button_link =  value;
                            return section;
                        }

                        return section;
                    })
                )
            }
        });
    }

    return (
        <div className="position-relative">
            <select className={button_link ? "active" : ""}
                    name="courses"
                    id="courses"
                    onChange={(e) => handleChange(e)}
                    value={button_link || ""}
                    onFocus={(e) => HandleFocus(e.target)}
            >
                <option></option>
                {courses?.map((course, index) => {
                    return <option key={index} value={`${url}/course/${course.slug}`} >{course.title}</option>
                })}
            </select>
            <label>Select Course</label>
        </div>
    );
};

export default DropdownComponent;
