import React, {useEffect, useRef, useState} from 'react';
import DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';

const Hero = ({ courseData }) => {

    const [textValue, setTextValue] = useState(courseData["intro_text"])

    const firstUpdate = useRef(true);

    useEffect(() => {

        if (firstUpdate.current) {
            setTextValue(draftToHtml(JSON.parse(courseData["intro_text"])));
            firstUpdate.current = false;
        } else {
            setTextValue(courseData["intro_text"])
        }

    },[courseData["intro_text"]])

    const createMarkup = (text) => {
        return {
            __html: DOMPurify.sanitize(text)
        }
    }

    return (
        <article className="intro_text my_row" style={{ background: courseData["intro_background_color"] || 'rgba(255,255,255,1)' }}>
           {/* <p style={{ color: courseData["intro_text_color"] || 'rgba(0,0,0,1)'}}>
                {
                courseData['intro_text']
            }</p>*/}
            <h2 className="title">{courseData['title']}</h2>
            <div dangerouslySetInnerHTML={createMarkup(textValue)}>
            </div>
        </article>
    );
};

export default Hero;
