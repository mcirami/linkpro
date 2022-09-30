import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    closeInfoBox,
    displayInfoBox,
    infoScrollPosition,
} from '../../../../Services/PageRequests';
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

    useEffect(() => {

        function handleScroll() {
            infoScrollPosition(setInfoLocation, infoClicked);
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    })

    return (
        <div
            className="tooltip_icon"
            onMouseLeave={() => closeInfoBox(setInfoTextOpen, infoClicked)}
        >
            <div className="icon_wrap"
                 onClick={(e) => displayInfoBox(e, setInfoText, setInfoTextOpen, setInfoLocation, setInfoClicked, infoClicked)}
                 onMouseOver={(e) => {
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
