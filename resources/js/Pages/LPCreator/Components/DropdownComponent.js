import React from 'react';
import {updateSectionData} from '../../../Services/LandingPageRequests';

const DropdownComponent = ({
                               courses,
                               button_link,
                               sections,
                               setSections,
                               id,
                               url
}) => {

    const handleChange = (e) => {

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
        <select name="courses" id="courses" onChange={(e) => handleChange(e)} value={button_link || ""}>
            <option value="">Select Course</option>
            {courses?.map((course, index) => {
                return <option key={index} value={`${url}/course/${course.slug}`} >{course.title}</option>
            })}
        </select>
    );
};

export default DropdownComponent;