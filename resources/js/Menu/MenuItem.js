import React from 'react';
import {toUpper} from 'lodash';
import HoverText from '../Utils/HoverText';

const MenuItem = ({
                      item,
                      userPermissions,
                      isHovering,
                      isOpen,
                      handleMouseOver,
                      handleMouseOut,
                      courseData
}) => {

    const {id, name, url, icon, permission} = item;

    return (
        (userPermissions.includes(permission) || permission === "all") &&
            <li>
                <a id={id}
                   style={courseData && {color: courseData["header_text_color"]}}
                   href={url}
                   onMouseOver={() => handleMouseOver(name)}
                   onMouseOut={handleMouseOut}
                >
                    <span className="menu_icon" style={courseData &&
                        {color: courseData["header_text_color"]}}>
                        {icon}
                    </span>
                    {toUpper(name)}
                </a>
                {(!isOpen && isHovering.status && isHovering.section === name) ?
                    <HoverText text={name}/>
                    :
                    ""
                }
            </li>
    );
};

export default MenuItem;
