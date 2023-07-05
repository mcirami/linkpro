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

    console.log(userPermissions);
    return (
        ( (userPermissions.includes(permission) || permission === "all") && id !== "pre_register") ||
        (id === "pre_register" && !userPermissions.includes("view dashboard") ) ?
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
                    <span className="text">{toUpper(name)}</span>
                </a>
                {(!isOpen && isHovering.status && isHovering.section === name) ?
                    <HoverText text={name}/>
                    :
                    ""
                }
            </li>
            :
            ""
    );
};

export default MenuItem;
