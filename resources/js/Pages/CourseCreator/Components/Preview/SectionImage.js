import React, {useEffect, useState} from 'react';

const SectionImage = ({
                          nodesRef,
                          completedCrop,
                          fileNames,
                          elementName,
                          imgUrl,
                          type

}) => {

    const [sectionImageStyle, setSectionImageStyle] = useState(null);

    const checkFound = () => {
        const isFound = fileNames?.find(el => {
            return el?.name === elementName;
        })
        return isFound || false;
    }

    useEffect(() => {
        setSectionImageStyle (
            checkFound() ?
                {
                    width: (completedCrop[elementName]?.isCompleted) ? `100%` : 0,
                    height: (completedCrop[elementName]?.isCompleted) ? `auto` : 0,
                    maxHeight: '232px',
                    overflow:'hidden'
                }
                :
                {
                    background: "url(" + imgUrl + ") center 25% no-repeat",
                    backgroundSize: 'cover',
                    padding: '29%'
                }
        )
    },[completedCrop[elementName], fileNames])

    return (
        <div style={sectionImageStyle}>
            {checkFound() ?
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
                :
                ""
                /*<div className={type} >
                    <img src={imgUrl} alt=""/>
                </div>*/
            }
        </div>
    );
};

export default SectionImage;
