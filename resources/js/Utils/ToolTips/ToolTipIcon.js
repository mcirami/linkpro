import React, {useContext, useEffect, useState} from 'react';
import {
    closeInfoBox,
    displayInfoBox,
    infoScrollPosition,
} from './ToolTipItems';
import {BiHelpCircle} from 'react-icons/bi';
import ToolTipContext from './ToolTipContext'
import data from './data';

const ToolTipIcon = ({section}) => {

    const {
        setInfoText,
        setInfoTextOpen,
        setInfoLocation,
        infoClicked,
        setInfoClicked,
        triangleRef
    } = useContext(ToolTipContext);

    useEffect(() => {

        function handleScroll() {
            infoScrollPosition(setInfoLocation, infoClicked);
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    })

    const handleMouseOver = (e) => {

        if (infoClicked === null) {
            setInfoClicked(e.target);
        } else if (infoClicked) {
            setInfoClicked(null)
            setInfoTextOpen(false);

            //return;
        }

        const name = e.target.dataset.section;
        const dataText = data.find((text) => text.section === name);
        setInfoText(dataText);
        setInfoTextOpen(true);

        const rect = e.target.getBoundingClientRect();
        const center = (rect.left + rect.right) / 2;
        const top = rect.top - 2;
        setInfoLocation({center, top});

        const triangleTop = rect.top - 20;
        const triangleLeft = rect.left - 3;
        triangleRef.style.top = `${triangleTop}px`;
        triangleRef.style.bottom = `${rect.bottom}px`;
        triangleRef.style.left = `${triangleLeft}px`;
        triangleRef.style.right = `${rect.right}px`;


        if (infoClicked === false) {
            setInfoClicked(null)
        }
    }
    const handleMouseLeave = () => {
        setInfoTextOpen(false)
    }

    return (
        <div
            className="tooltip_icon"
            onMouseLeave={() => {
                handleMouseLeave()
                //closeInfoBox(setInfoTextOpen, infoClicked)
            }}
        >
            <div className="icon_wrap"
                 onClick={(e) => {
                     displayInfoBox(e, setInfoText, setInfoTextOpen, setInfoLocation, setInfoClicked, infoClicked, triangleRef)}}
                 //onMouseOver={(e) => displayInfoBox(e, setInfoText, setInfoTextOpen, setInfoLocation, setInfoClicked, triangleRef)}
                 onMouseEnter={(e) => handleMouseOver(e)}
                 data-section={section}
            >
                <BiHelpCircle />
            </div>

        </div>

    );
};

export default ToolTipIcon;
