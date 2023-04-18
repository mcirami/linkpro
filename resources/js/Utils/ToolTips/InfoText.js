import React, {useContext, useEffect, useRef} from 'react';
import ToolTipContext from './ToolTipContext'


const InfoText = ({divRef}) => {

    const infoDiv = useRef();

    const {
        infoText,
        infoLocation,
        infoTextOpen,
    } = useContext(ToolTipContext);

    useEffect(() => {

        const infoBox = infoDiv.current;

        setTimeout(() => {
            const {center, top} = infoLocation;
            const vert =  (top - infoBox.offsetHeight) - 10;
            const horz = (center - infoBox.offsetWidth) + 15;

            infoBox.style.left = ` ${horz}px`;
            infoBox.style.top = `${vert}px`;
        })

        if (infoText.section.includes('manager')) {
            infoBox.style.maxWidth = `${divRef.current.offsetWidth * .62}px`
        } else {
            infoBox.style.maxWidth = `${divRef.current.offsetWidth * .92}px`
        }
    }, [infoLocation, infoText])

    useEffect(() => {

        function handleResize() {
            const infoBox = infoDiv.current;
            const {center, top} = infoLocation;
            let wrapWidth;
            if (infoText.section.includes('manager')) {
                wrapWidth = divRef.current.offsetWidth * .62;
            } else {
                wrapWidth = divRef.current.offsetWidth * .92;
            }

            //const wrapWidth = divRef.current.offsetWidth * .92;

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
                            {text.title &&
                                <h3>{text.title}</h3>
                            }
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
