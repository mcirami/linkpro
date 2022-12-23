import React, {useEffect, useState} from 'react';
import SectionImage from './SectionImage';

const PreviewSection = ({
                            currentSection,
                            nodesRef,
                            completedCrop,
                            fileNames,
                            position,
                            pageData
}) => {

   /* console.log("completed crop: ", completedCrop);
    console.log("el name: ", elementName);
    console.log("with el name: ", completedCrop[elementName]);
    console.log("nodesRef: ", nodesRef.current)
    console.log("filenames: ", fileNames);*/
    //console.log("nodesRef: ", nodesRef.current[elementName])


    const {type, bg_color, text_color, text, image, button, button_position} = currentSection;
    const [buttonStyle, setButtonStyle] = useState(null);

    useEffect(() => {
        setButtonStyle ({
            background: pageData["button_color"],
            color: pageData["button_text_color"]
        })

    },[pageData["button_color"], pageData["button_text"]])

    const Button = ({buttonText}) => {
        return (
            <div className={`button_wrap ${button_position ? button_position : "above"}`}>
                <a href="#"
                   className="button"
                   style={buttonStyle}
                >{buttonText || "Get Course"}</a>
            </div>
        )
    }

    return (
        <section className="my_row">
            <div className={type} style={{ background: bg_color || 'rgba(255,255,255,1)'}}>
                {( !!button && button_position === "above") &&
                    <Button
                        buttonText={pageData["button_text"]}
                    />
                }
                {{
                    "text":
                        <div className="container">
                            <p
                                style={{ color: text_color || 'rgba(0,0,0,1)'}}
                            >{text || ""}</p>
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
