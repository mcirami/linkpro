import React, {useEffect, useState} from 'react';

const PreviewSection = ({
                            colors,
                            data,
                            textArray,
                            nodesRef,
                            nodes,
                            completedCrop,
                            fileNames,
                            isFound,
                            setIsFound,
                            elementName
}) => {

    const [sectionImageStyle, setSectionImageStyle] = useState(null);

    const {type, position, bgColor, textColor, text, imgUrl} = data;

    useEffect(() => {
        setIsFound(checkFound())
    },[fileNames])

    const checkFound = () => {
        const isFound = fileNames?.find(el => {
            return el?.name === "hero";
        })
        return isFound || false;
    }

    useEffect(() => {
        setSectionImageStyle (
            checkFound() ?
                {
                    width: (completedCrop.header?.isCompleted) ? `100%` : 0,
                    height: (completedCrop.header?.isCompleted) ? `auto` : 0,
                    maxHeight: '200px',
                    overflow:'hidden'
                }
                :
                {
                    background: "url(" +
                        Vapor.asset("images/default-img.png") +
                        ") center 25% no-repeat",
                    backgroundSize: "20%",
                    minHeight: "200px"
                }
        )
    },[completedCrop.elementName, fileNames])

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
                    <div style={sectionImageStyle}>
                        {checkFound() ?

                            <canvas
                                className="bg_image"
                                ref={ref => nodesRef.current[elementName] = ref}
                                // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                style={{
                                    backgroundImage: nodesRef.current[elementName],
                                    /*width: Math.round(completedCrop?.width ?? 0),
                                    height: Math.round(completedCrop?.height ?? 0)*/
                                    backgroundSize: `cover`,
                                    backgroundRepeat: `no-repeat`,
                                    width: completedCrop.elementName?.isCompleted ? `100%` : 0,
                                    height: completedCrop.elementName?.isCompleted ? `auto` : 0,
                                }}
                            />
                            :
                            <div className={type} >
                                <img src={imgUrl} alt=""/>
                            </div>}
                        </div>,
            }[type]}
        </section>
    );
};

export default PreviewSection;
