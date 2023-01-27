import React, {useEffect, useState} from 'react';
const logo = user.LPLogo;

const TopBar = ({courseData}) => {


    return (
        <div className="top_section" style={{
            background: courseData["header_color"] || '#000'
        }}>
            <div className="logo">
                <img src={logo || Vapor.asset("images/logo.png") } alt=""/>
            </div>
        </div>

    );
};

export default TopBar;
