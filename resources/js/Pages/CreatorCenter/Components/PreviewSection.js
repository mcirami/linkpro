import React, {useEffect, useState} from 'react';
import DOMPurify from 'dompurify';
import SectionImage from '../../LPCreator/Components/Preview/SectionImage';

const PreviewSection = ({section}) => {

    const [buttonStyle, setButtonStyle] = useState(null);
    const {
        type,
        bg_color,
        text,
        image,
        button,
        button_position,
        button_link,
        button_size,
        button_text,
        button_text_color,
        button_color
    } = section;

    useEffect(() => {
        setButtonStyle ({
            background: button_color,
            color: button_text_color,
            width: button_size + "%",
        })

    },[])

    const createMarkup = (text) => {
        return {
            __html: DOMPurify.sanitize(text)
        }
    }

    const Button = ({buttonText}) => {
        return (
            <div className={`button_wrap my_row ${button_position ? button_position : "above"}`}>
                <a href={button_link}
                   target="_blank"
                   className="button"
                   style={buttonStyle}
                >{buttonText || "Get Course"}</a>
            </div>
        )
    }

    return (
        <section>
            <div className={type} style={{ background: bg_color || 'rgba(255,255,255,1)'}}>
                {( !!button && button_position === "above") &&
                    <Button
                        buttonText={button_text}
                    />
                }
                {{
                    "text":
                        <div dangerouslySetInnerHTML={createMarkup(text)}>
                        </div>,
                    "image":
                        <div className="image_bg"
                             style={{
                                 background: "url(" + image + ") center no-repeat",
                                 backgroundSize: 'cover',
                                 minHeight: '130px'
                             }}>
                        </div>,
                }[type]}
                {( !!button && button_position === "below") &&
                    <Button
                        buttonText={button_text}
                    />
                }
            </div>
        </section>
    );
};

export default PreviewSection;
