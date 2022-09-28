import React, {useContext, useEffect, useRef} from 'react';
import {closeInfoBox, displayInfoBox} from '../../../../Services/PageRequests';
import {BiHelpCircle} from 'react-icons/bi';
import {PageContext} from '../../App';

const ToolTipIcon = ({section}) => {

    const {
        setInfoText,
        setInfoTextOpen,
        setInfoLocation,
        infoClicked,
        setInfoClicked
    } = useContext(PageContext);

    const infoDiv = useRef();

    useEffect(() => {

        function handleScroll() {
            closeInfoBox(setInfoTextOpen, false, setInfoClicked);
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    })

    return (
        <div
            ref={infoDiv}
            className="tooltip_icon"
            onMouseLeave={() => closeInfoBox(setInfoTextOpen, infoClicked)}
        >
            <div className="icon_wrap"
                 onClick={(e) => displayInfoBox(e, setInfoText, setInfoTextOpen, setInfoLocation, setInfoClicked, infoClicked)}
                 onMouseOver={(e) => {
                     setInfoClicked(false);
                     displayInfoBox(e, setInfoText, setInfoTextOpen, setInfoLocation, setInfoClicked)
                 }}
                 data-section={section}
            >
                <BiHelpCircle />
            </div>
        </div>
    );
};

export default ToolTipIcon;
