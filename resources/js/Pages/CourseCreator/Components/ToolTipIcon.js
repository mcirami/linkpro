import React, {useRef} from 'react';
import {BiHelpCircle} from 'react-icons/bi';

const ToolTipIcon = ({
                         section,
                         setIsHovering,
                         infoTextRef,
                         setStyles,
                         isClicked,
                         setIsClicked
}) => {

    const iconRef = useRef();

    const handleMouseOver = () => {
        setIsHovering({
            status: true,
            section: section
        })

        setStyles (
            {
                position: 'absolute',
                top: '-' + (infoTextRef.current.clientHeight + iconRef.current.clientHeight + 5) + 'px'
            }
        )

    }

    const handleMouseOut = () => {
        setIsHovering({
            status: false,
            section: null
        });
    }

    const handleMouseClick = () => {

        if(isClicked.status && isClicked.section === section) {
            setIsClicked({
                status: false,
                section: null
            })
        } else {
            setIsClicked({
                status: true,
                section: section
            })
        }

    }

    return (
        <div
            ref={iconRef}
            className="tooltip_icon"
            onMouseLeave={handleMouseOut}
            onClick={handleMouseClick}
        >
            <div className="icon_wrap"
                 onMouseOver={handleMouseOver}
            >
                <BiHelpCircle />
            </div>
        </div>
    );
};

export default ToolTipIcon;
