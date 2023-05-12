import React from 'react';
import DeleteSection from './DeleteSection';
import {MdKeyboardArrowDown} from 'react-icons/md';
import InputComponent from './InputComponent';
import ColorPicker from './ColorPicker';
import ImageComponent from './ImageComponent';
import SectionButtonOptions from './SectionButtonOptions';
const courses = user.courses;

const Section = ({
                     section,
                     index,
                     completedCrop,
                     setCompletedCrop,
                     nodesRef,
                     fileNames,
                     setFileNames,
                     sections,
                     setSections,
                     url,
                     openIndex,
                     setOpenIndex,
                     setShowLoader
}) => {

    const {id, type, text, button_position, button, button_link, button_size} = section;

    const handleSectionOpen = (rowIndex) => {
        if(openIndex.includes(rowIndex)) {
            const newArrayIndex = openIndex.filter(element => element !== rowIndex)
            setOpenIndex(newArrayIndex)
        } else {
            const newArrayIndex = openIndex.concat(rowIndex);
            setOpenIndex(newArrayIndex);
        }
    }


    return (
        <div className="section_row">
            <div className="section_title" onClick={(e) => handleSectionOpen(index)}>
                <div className="left_column">
                    <h4>Section {index + 1}</h4>
                    <DeleteSection
                        id={id}
                        sections={sections}
                        setSections={setSections}
                    />
                </div>
                <div className={`icon_wrap ${openIndex.includes(index) ? "open" : ""}`}>
                    <MdKeyboardArrowDown />
                </div>
            </div>
            <div className={`section_content my_row ${openIndex.includes(index) ? "open" : ""}`}>
                {type === "text" &&
                    <>
                        <InputComponent
                            placeholder="Add Text"
                            type="textarea"
                            hoverText={`Add Text to Section ${index + 1}`}
                            elementName={`section_${index + 1}_text`}
                            value={text}
                            currentSection={section}
                            sections={sections}
                            setSections={setSections}
                        />
                        <ColorPicker
                            label="Background Color"
                            currentSection={section}
                            sections={sections}
                            setSections={setSections}
                            elementName={`section_${index + 1}_bg_color`}
                        />
                        {/* <ColorPicker
                            label="Text Color"
                            currentSection={section}
                            sections={sections}
                            setSections={setSections}
                            elementName={`section_${index + 1}_text_color`}
                        />*/}
                    </>
                }
                {type === "image" &&
                    <ImageComponent
                        nodesRef={nodesRef}
                        completedCrop={completedCrop}
                        setCompletedCrop={setCompletedCrop}
                        fileNames={fileNames}
                        setFileNames={setFileNames}
                        setShowLoader={setShowLoader}
                        currentSection={section}
                        sections={sections}
                        setSections={setSections}
                        elementName={`section_${index + 1}_image`}
                        cropArray={{
                            unit: "%",
                            width: 30,
                            x: 25,
                            y: 25,
                            aspect: 16 / 8
                        }}
                    />
                }
                <div className="my_row">
                    <SectionButtonOptions
                        position={index + 1}
                        buttonPosition={button_position}
                        includeButton={button}
                        sections={sections}
                        setSections={setSections}
                        currentSection={section}
                        button_link={button_link}
                        buttonSize={button_size}
                        courses={courses}
                        id={id}
                        url={url}
                    />
                </div>
            </div>
        </div>
    );
};

export default Section;
