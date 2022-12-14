import React, {useEffect, useState} from 'react';

const Hero = ({
                  nodesRef,
                  nodes,
                  completedCrop,
                  fileNames,
                  colors,
                  textArray,
                  isFound,
                  setIsFound,
                  elementName
}) => {

    console.log("header image node ref: ", nodesRef.current[elementName]);

    const [headerImageStyle, setHeaderImageStyle] = useState(null);
    const [buttonStyle, setButtonStyle] = useState(null);

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
        setHeaderImageStyle (
            checkFound() ?
                {
                    width: (completedCrop[elementName]?.isCompleted) ? `100%` : 0,
                    height: (completedCrop[elementName]?.isCompleted) ? `auto` : 0,
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
    },[completedCrop[elementName], fileNames])

    useEffect(() => {
        setButtonStyle ({
            background: colors.buttonBg || '#000000',
            color: colors.buttonText || '#ffffff'
        })

    },[colors.buttonBg, colors.buttonText])

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
                {textArray.buttonText || "Get Course"}
            </a>
        </article>
    );
};

export default Hero;
