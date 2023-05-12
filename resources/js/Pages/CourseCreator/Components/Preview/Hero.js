import React, {useEffect, useRef, useState} from 'react';
import DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';

const Hero = ({ courseData }) => {

    const [textValue, setTextValue] = useState(courseData["intro_text"])

    const firstUpdate = useRef(true);

    useEffect(() => {

        if (courseData["intro_text"]) {
            if (firstUpdate.current) {
                setTextValue(draftToHtml(JSON.parse(courseData["intro_text"])));
                firstUpdate.current = false;
            } else {
                setTextValue(courseData["intro_text"])
            }
        }

    },[courseData["intro_text"]])

    const createMarkup = (text) => {
        return {
            __html: DOMPurify.sanitize(text)
        }
    }

    return (
        <div className="hero_section">
            {courseData['intro_video'] &&
                <div className="video_wrapper" id="preview_intro_video_section">
                    <iframe src={courseData['intro_video']} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
                </div>
            }
            {courseData["intro_text"] &&
                <article id="preview_intro_text_section"
                         className="intro_text my_row"
                         style={{
                             background: courseData["intro_background_color"] || 'rgba(255,255,255,1)'
                        }}
                >
                    <div dangerouslySetInnerHTML={createMarkup(textValue)}></div>
                </article>
            }
        </div>
    );
};

export default Hero;
