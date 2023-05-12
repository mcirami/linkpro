import React from 'react';
import DeleteSection from './DeleteSection';
import {MdKeyboardArrowDown} from 'react-icons/md';
import InputComponent from './InputComponent';
import ColorPicker from './ColorPicker';
import SectionButtonOptions from './SectionButtonOptions';

const Section = ({
                     section,
                     index,
                     sections,
                     setSections,
                     openIndex,
                     setOpenIndex,
                     videoCount,
                     textCount,
                     setHoverSection

}) => {

    const {
        id,
        type,
        text,
        video_title,
        video_link
    } = section;
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
        <div id={`section_${index + 1}`}
             className="section_row"
             onMouseEnter={(e) =>
                 setHoverSection(e.target.id)
             }>
            <div className="section_title" onClick={(e) => handleSectionOpen(index)}>
                <div className="left_column">
                    <h4>{type} {type === "video" ? videoCount : textCount}</h4>
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
                {type === "text" ?
                    <>
                        <InputComponent
                            placeholder="Add Text"
                            type="textarea"
                            hoverText="Add Text to Section"
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
                            elementName={`section_${index + 1}_background_color`}
                        />
                        <ColorPicker
                            label="Text Color"
                            currentSection={section}
                            sections={sections}
                            setSections={setSections}
                            elementName={`section_${index + 1}_text_color`}
                        />

                        <SectionButtonOptions
                            position={index + 1}
                            sections={sections}
                            setSections={setSections}
                            currentSection={section}
                            id={id}
                        />

                    </>
                    :
                    <>
                        <InputComponent
                            placeholder="Video Title"
                            type="text"
                            maxChar={65}
                            hoverText="Add Video Title"
                            elementName={`video_${index + 1}_title`}
                            value={video_title || ""}
                            currentSection={section}
                            sections={sections}
                            setSections={setSections}
                        />
                        <InputComponent
                            placeholder="YouTube or Vimeo Link"
                            type="url"
                            hoverText="Add Embed Link"
                            elementName={`video_${index + 1}_link`}
                            value={video_link || ""}
                            currentSection={section}
                            sections={sections}
                            setSections={setSections}
                        />
                        <InputComponent
                            placeholder="Video Text Blurb (optional)"
                            type="textarea"
                            hoverText={`Submit Text Blurb`}
                            elementName={`section_${index + 1}_text`}
                            value={text || ""}
                            currentSection={section}
                            sections={sections}
                            setSections={setSections}
                        />
                        <ColorPicker
                            label="Background Color"
                            currentSection={section}
                            sections={sections}
                            setSections={setSections}
                            elementName={`section_${index + 1}_background_color`}
                        />
                        <ColorPicker
                            label="Text Color"
                            currentSection={section}
                            sections={sections}
                            setSections={setSections}
                            elementName={`section_${index + 1}_text_color`}
                        />
                    </>
                }
            </div>
        </div>
    );
};

export default Section;
