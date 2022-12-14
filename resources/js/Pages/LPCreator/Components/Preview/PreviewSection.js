import React, {useEffect, useState} from 'react';
import SectionImage from './SectionImage';

const PreviewSection = ({
                            colors,
                            data,
                            textArray,
                            nodesRef,
                            completedCrop,
                            fileNames,
                            isFound,
                            setIsFound,
}) => {

   /* console.log("completed crop: ", completedCrop);
    console.log("el name: ", elementName);
    console.log("with el name: ", completedCrop[elementName]);
    console.log("nodesRef: ", nodesRef.current)
    console.log("filenames: ", fileNames);*/
    //console.log("nodesRef: ", nodesRef.current[elementName])


    const {type, position, bgColor, textColor, text, imgUrl} = data;



    /*useEffect(() => {
        setButtonStyle ({
            background: colors.buttonBg || '#000000',
            color: colors.buttonText || '#ffffff'
        })

    },[colors.buttonBg, colors.buttonText])*/

    return (
        <section className="my_row">
            {{
                "text":
                    <div className={type} style={{ background: colors["section" + position + "BgColor"] || bgColor}}>
                        <div className="container">
                            <p
                                style={{ color: colors["section" + position + "TextColor"] || textColor}}
                            >{textArray["section" + position + "Text"] || text}</p>
                        </div>
                    </div>,
                "image":
                    <SectionImage
                        nodesRef={nodesRef}
                        completedCrop={completedCrop}
                        fileNames={fileNames}
                        isFound={isFound}
                        setIsFound={setIsFound}
                        elementName={"section"+position+type}
                        imgUrl={imgUrl}
                        type={type}
                    />,
            }[type]}
        </section>
    );
};

export default PreviewSection;
