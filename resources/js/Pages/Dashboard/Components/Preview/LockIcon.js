import React from 'react';
import {toolTipClick} from '../../../../Services/PageRequests';
import {BiHelpCircle} from 'react-icons/bi';
import {IoIosLock} from 'react-icons/io';

const LockIcon = ({infoIndex, setInfoIndex}) => {


    return (
        <span className="lock_icon">
            <span className="tooltip_icon" onClick={() => toolTipClick(7, infoIndex, setInfoIndex)}>
                <BiHelpCircle />
                <p className={`tooltip ${infoIndex === 7 ? " open" : "" }` }>
                    Link is password protected
                </p>
            </span>
            <IoIosLock/>

        </span>
    );
};

export default LockIcon;
