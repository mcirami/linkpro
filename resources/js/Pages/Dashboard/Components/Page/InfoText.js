import React, {useContext, useEffect, useRef} from 'react';
import { Element } from  'react-scroll';
import {infoScrollPosition} from '../../../../Services/PageRequests';
import {PageContext} from '../../App';

const InfoText = ({leftColWrap}) => {

    const infoDiv = useRef();

    const {
        infoText,
        infoLocation,
        infoTextOpen,
    } = useContext(PageContext);

    useEffect(() => {
        const infoBox = infoDiv.current;
        const {center, top} = infoLocation;
        const vert =  (top - infoDiv.current.offsetHeight) - 10;
        const horz = (center - infoDiv.current.offsetWidth) + 15;

        infoBox.style.left = ` ${horz}px`;
        infoBox.style.top = `${vert}px`;

        if (infoText.section === 'lock') {
            infoBox.style.maxWidth = `200px`
        } else {
            infoBox.style.maxWidth = `${leftColWrap.current.offsetWidth * .92}px`
        }
    }, [infoLocation, infoText])

    useEffect(() => {

        function handleResize() {
            const infoBox = infoDiv.current;
            const {center, top} = infoLocation;
            const wrapWidth = leftColWrap.current.offsetWidth * .92;

            const vert =  (top - infoDiv.current.offsetHeight) - 10;
            const horz = (center - infoDiv.current.offsetWidth) + 15;

            infoBox.style.left = ` ${horz}px`;
            infoBox.style.top = `${vert}px`;
            infoBox.style.maxWidth = `${wrapWidth}px`;
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    },[])

    return (

        <div ref={infoDiv} className={`${infoTextOpen ?
            "hover_text help open" :
            "hover_text help"}`}>

                {infoText?.text?.map((text, index) => {
                    return (
                        <React.Fragment key={index}>
                            <p>{text.description}</p>
                            {text.subTitle &&
                                <h5>{text.subTitle}</h5>
                            }
                            {text.tip &&
                                <p>{text.tip}</p>
                            }
                        </React.Fragment>
                    )
                })}


        </div>

    );
};

export default InfoText;
