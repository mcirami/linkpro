import React, {useEffect, useState, useRef} from 'react';
import SectionImage from './SectionImage';
import DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';

const PreviewSection = ({
                            currentSection,
                            nodesRef,
                            completedCrop,
                            fileNames,
                            position,
                            pageData
}) => {

    const {type, bg_color, text_color, text, image, button, button_position, button_link} = currentSection;
    const [buttonStyle, setButtonStyle] = useState(null);
    const [textValue, setTextValue] = useState(text)

    const firstUpdate = useRef(true);

    useEffect(() => {
        setButtonStyle ({
            background: pageData["button_color"],
            color: pageData["button_text_color"]
        })

    },[pageData["button_color"], pageData["button_text"], pageData["button_text_color"]])

    useEffect(() => {

        if (firstUpdate.current) {
            setTextValue(draftToHtml(JSON.parse(text)));
            firstUpdate.current = false;
        } else {
            setTextValue(text)
        }

    },[text])

    const createMarkup = (text) => {
        return {
            __html: DOMPurify.sanitize(text)
        }
    }


    const Button = ({buttonText}) => {
        return (
            <div className={`button_wrap ${button_position ? button_position : "above"}`}>
                <a href={button_link}
                   target="_blank"
                   className="button"
                   style={buttonStyle}
                >{buttonText || "Get Course"}</a>
            </div>
        )
    }

    return (
        <section>
            <div className={type} style={{ background: bg_color || 'rgba(255,255,255,1)'}}>
                {( !!button && button_position === "above") &&
                    <Button
                        buttonText={pageData["button_text"]}
                    />
                }
                {{
                    "text":
                        <div dangerouslySetInnerHTML={createMarkup(textValue)}>
                        </div>,
                    "image":
                        <SectionImage
                            nodesRef={nodesRef}
                            completedCrop={completedCrop}
                            fileNames={fileNames}
                            elementName={"section_"+ position + "_" + type}
                            imgUrl={image}
                            type={type}
                        />,
                }[type]}
                {( !!button && button_position === "below") &&
                    <Button
                        buttonText={pageData["button_text"]}
                    />
                }
            </div>
        </section>
    );
};

export default PreviewSection;
