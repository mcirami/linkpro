import React, {useEffect, useState} from 'react';

const Hero = ({
                  nodesRef,
                  completedCrop,
                  fileNames,
                  elementName,
                  pageData
}) => {

    const [headerImageStyle, setHeaderImageStyle] = useState(null);
    const [buttonStyle, setButtonStyle] = useState(null);

    const checkFound = () => {
        const isFound = fileNames?.find(el => {
            return el?.name === "hero";
        })
        return isFound || false;
    }

    useEffect(() => {
        setHeaderImageStyle (
            checkFound() ?
                {
                    width: (completedCrop[elementName]?.isCompleted) ? `100%` : 0,
                    height: (completedCrop[elementName]?.isCompleted) ? `auto` : 0,
                    maxHeight: '152px',
                    overflow:'hidden'
                }
                :
                {
                    background: "url(" +
                        pageData["hero"] || Vapor.asset("images/default-img.png") +
                        ") center 25% no-repeat",
                    backgroundSize: pageData["hero"] ? "cover" : "20%",
                    backgroundRepeat: "no-repeat",
                    minHeight: "152px"
                }
        )
    },[completedCrop[elementName], fileNames])

    useEffect(() => {
        setButtonStyle ({
            background: pageData["button_color"] || '#000000',
            color: pageData["button_text_color"] || '#ffffff'
        })

    },[pageData["button_color"], pageData["button_text_color"]])

    return (
        <article className="header_image my_row"
                 style={headerImageStyle}>
            {checkFound() &&
                <canvas
                    className={`${elementName}_bg_image`}
                    ref={ref => nodesRef.current[elementName] = ref}
                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                    style={{
                        backgroundImage: nodesRef.current[elementName],
                        /*width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0)*/
                        backgroundSize: `cover`,
                        backgroundRepeat: `no-repeat`,
                        width: completedCrop[elementName]?.isCompleted ? `100%` : 0,
                        height: completedCrop[elementName]?.isCompleted ? `auto` : 0,
                    }}
                />
            }
            <a className="button" href="#" style={buttonStyle}>
                {pageData["button_text"] || "Get Course"}
            </a>
        </article>
    );
};

export default Hero;
