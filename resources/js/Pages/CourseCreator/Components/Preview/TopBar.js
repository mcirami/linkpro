import React, {useEffect, useState} from 'react';
const lpData = user.LPData;

const TopBar = () => {

    return (
        <div className="top_section" style={{
            background: lpData["header_color"] || '#000'
        }}>
            <div className="logo">
                <img src={lpData["logo"] || Vapor.asset("images/logo.png") } alt=""/>
            </div>
        </div>

    );
};

export default TopBar;
