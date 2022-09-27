import React, {useEffect, useRef} from 'react';
import { Element } from  'react-scroll';

const InfoText = ({infoText, infoTextOpen, infoLocation, leftColWrap}) => {

    const infoDiv = useRef();

    useEffect(() => {
        const infoBox = infoDiv.current;
        const {center, top} = infoLocation;
        const wrapWidth = leftColWrap.current.clientWidth * .90;

        const horz =  (top - infoDiv.current.clientHeight) - 10;
        const vert = (center - infoDiv.current.clientWidth) + 15;

        infoBox.style.left = ` ${vert}px`;
        infoBox.style.top = `${horz}px`;
        infoBox.style.maxWidth = `${wrapWidth}px`
    })

    return (
        <>
            <Element ref={infoDiv} className={`${infoTextOpen ?
                "hover_text help open" :
                "hover_text help"}`}>

                    {infoText?.text?.map((text, index) => {
                        return (
                            <React.Fragment key={index}>
                                <p>{text.description}</p>
                                <h5>{text.subTitle}</h5>
                                <p>{text.tip}</p>
                            </React.Fragment>
                        )
                    })}


            </Element>

        </>
    );
};

export default InfoText;
