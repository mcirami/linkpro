import React, {useEffect, useRef, useState} from 'react';
import ToolTipIcon from './ToolTipIcon';
import hoverText from './InfoTextData';

const InfoText = ({section}) => {

    const [infoText, setInfoText] = useState("");
    const [isHovering, setIsHovering] = useState({
        status: false,
        section: null
    });

    const [isClicked, setIsClicked] = useState({
        status: false,
        section: null
    });

    const [styles, setStyles] = useState({});

    const infoTextRef = useRef();

    useEffect(() => {

        const currentSection = hoverText.find((text) => text.section === section);
        setInfoText(currentSection.text[0].description);

    },[]);

    return (
        <>
            <div style={styles} ref={infoTextRef} className={`
            hover_text help course_creator
            ${(isHovering.status && isHovering.section === section) || (isClicked.status && isClicked.section === section) ? "open" : ""}
            `}>
                <p>{infoText}</p>
            </div>

            <ToolTipIcon
                section={section}
                setIsHovering={setIsHovering}
                infoTextRef={infoTextRef}
                setStyles={setStyles}
                isClicked={isClicked}
                setIsClicked={setIsClicked}
            />
        </>
    );
};

export default InfoText;
