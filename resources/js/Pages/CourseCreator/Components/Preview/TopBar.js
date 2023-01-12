import React, {useEffect, useState} from 'react';
const logo = user.LPLogo;

const TopBar = ({courseData}) => {


    return (
        <div className="top_section" style={{
            background: courseData["header_color"] || '#000'
        }}>
            <div className="container">
                <article className="logo">
                    <img src={logo || Vapor.asset("images/logo.png") } alt=""/>
                </article>
            </div>
        </div>

    );
};

export default TopBar;
