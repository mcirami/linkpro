import React, {useEffect, useState} from 'react';

const Hero = ({ courseData }) => {

    return (
        <article className="intro_text my_row" style={{ background: courseData["intro_background_color"] || 'rgba(255,255,255,1)' }}>
            <p style={{ color: courseData["intro_text_color"] || 'rgba(0,0,0,1)'}}>{ courseData['intro_text'] }</p>
        </article>
    );
};

export default Hero;
