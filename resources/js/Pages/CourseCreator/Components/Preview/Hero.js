import React, {useEffect, useState} from 'react';

const Hero = ({
                  courseData
}) => {

    /*const [buttonStyle, setButtonStyle] = useState(null);*/

   /* useEffect(() => {
        setButtonStyle ({
            background: courseData["button_color"] || '#000000',
            color: courseData["button_text_color"] || '#ffffff'
        })

    },[courseData["button_color"], courseData["button_text_color"]])*/

    return (
        <article className="intro_text my_row" style={{ background: courseData["intro_background_color"] || 'rgba(255,255,255,1)' }}>
            <p style={{ color: courseData["intro_text_color"] || 'rgba(0,0,0,1)'}}>{ courseData['intro_text'] }</p>
            {/*<a className="button" href="#" style={buttonStyle}>
                {courseData["button_text"] || "Get Course"}
            </a>*/}
        </article>
    );
};

export default Hero;
