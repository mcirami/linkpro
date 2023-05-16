import React, {useEffect, useState} from 'react';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';
import {round} from 'lodash/math';

const SectionComponent = ({section}) => {

    //const bgImage = section.type === "image" && section.image ? section.image : Vapor.asset('images/image-placeholder.jpg');

    const [bgStyle, setBgStyle] = useState(null);
    const [buttonStyle, setButtonStyle] = useState(null);

    const {
        id,
        type,
        image,
        bg_color,
        button,
        button_position,
        button_link,
        button_color,
        button_text_color,
        button_text,
        button_size,
        text
    } = section;


    useEffect(() => {
        setButtonStyle ({
            background: button_color,
            color: button_text_color,
            width: button_size + "%",
        })

    },[])

    const createMarkup = (text) => {

        const html = draftToHtml(JSON.parse(text));
        return {
            __html: DOMPurify.sanitize(html)
        }
    }

    useEffect(() => {

        if(type === "image") {
            if(section.image) {
                setBgStyle ({
                    background: "url(" + image + ") no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover"
                })
            } else {
                setBgStyle ({
                    background: "url(" + Vapor.asset('images/image-placeholder.jpg') + ") no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "30%",
                    backgroundColor: '#f4f4f4',
                })
            }
        }

    },[])

    const Button = ({buttonText}) => {
        return (
            <div id={id} className={`button_wrap ${button_position ? button_position : "above"}`}>
                <a href={button_link}
                   target="_blank"
                   className="button"
                   style={buttonStyle}
                >{buttonText || "Get Course"}</a>
            </div>
        )
    }

    return (
        <section className={type} style={ type === "text" ? { background: bg_color } : bgStyle }>
            {type === "text" &&
                <div className="container">
                    { (button && button_position === "above") ?
                        <Button buttonText={button_text} />
                        :
                        ""
                    }
                    <div dangerouslySetInnerHTML={createMarkup(text)}>
                    </div>
                    { (button && button_position === "below") ?
                        <Button buttonText={button_text} />
                        :
                        ""
                    }
                </div>
            }
            {type === "image" &&
                button ?
                    <Button buttonText={button_text} />
                    :
                    ""
            }
        </section>
    );
};

export default SectionComponent;
