import React, {useEffect, useState} from 'react';
import SectionImage from './SectionImage';

const PreviewSection = ({
                            colors,
                            data,
                            textArray,
                            nodesRef,
                            completedCrop,
                            fileNames,
                            position
}) => {

   /* console.log("completed crop: ", completedCrop);
    console.log("el name: ", elementName);
    console.log("with el name: ", completedCrop[elementName]);
    console.log("nodesRef: ", nodesRef.current)
    console.log("filenames: ", fileNames);*/
    //console.log("nodesRef: ", nodesRef.current[elementName])


    const {type, bgColor, textColor, text, imgUrl, includeButton, buttonPosition} = data;
    const [buttonStyle, setButtonStyle] = useState(null);

    useEffect(() => {
        setButtonStyle ({
            background: colors.buttonBg || '#000000',
            color: colors.buttonText || '#ffffff'
        })

    },[colors.buttonBg, colors.buttonText])

    const Button = ({buttonText}) => {
        return (
            <div className={`button_wrap ${buttonPosition ? buttonPosition : "above"}`}>
                <a href="#"
                   className="button"
                   style={buttonStyle}
                >{buttonText || "Get Course"}</a>
            </div>
        )
    }

    return (
        <section className="my_row">
            {{
                "text":
                    <div className={type} style={{ background: colors["section" + position + "BgColor"] || bgColor}}>
                        <div className="container">
                            {(includeButton && (buttonPosition === "above" || !buttonPosition)) &&
                               <Button
                                   buttonText={textArray.buttonText}
                               />
                            }
                            <p
                                style={{ color: colors["section" + position + "TextColor"] || textColor}}
                            >{textArray["section" + position + "Text"] || text}</p>
                            {(includeButton && buttonPosition === "below") &&
                                <Button
                                    buttonText={textArray.buttonText}
                                />
                            }
                        </div>
                    </div>,
                "image":
                    <SectionImage
                        nodesRef={nodesRef}
                        completedCrop={completedCrop}
                        fileNames={fileNames}
                        elementName={"section"+position+type}
                        imgUrl={imgUrl}
                        type={type}
                    />,
            }[type]}
        </section>
    );
};

export default PreviewSection;
