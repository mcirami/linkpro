import React from 'react';
import {updateSectionData} from '../../../Services/LandingPageRequests';

const DropdownComponent = ({
                               courses,
                               button_link,
                               sections,
                               setSections,
                               id
}) => {

    const handleChange = (e) => {

        const packets = {
            button_link: e.target.value
        }

        updateSectionData(packets, id).then((response) => {
            if(response.success) {
                setSections(
                    sections.map((section) => {
                        if(section.id === id) {
                            section.button_link =  e.target.value;
                        }

                        return section;
                    })
                )
            }
        });
    }

    return (
        <select name="courses" id="courses" onChange={(e) => handleChange(e)} value={button_link || ""}>
            <option value="">Select Course</option>
            {courses?.map((course, index) => {
                return <option key={index} value={course.title} >{course.title}</option>
            })}
        </select>
    );
};

export default DropdownComponent;
