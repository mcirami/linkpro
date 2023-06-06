import React, {useEffect, useState} from 'react';
//const lpData = user.LPData;

const TopBar = () => {

    return (
        <div className="top_section" style={{
            background: '#fff'
        }}>
            <div className="logo">
                <img src={Vapor.asset("images/logo.png") } alt=""/>
            </div>
        </div>

    );
};

export default TopBar;
