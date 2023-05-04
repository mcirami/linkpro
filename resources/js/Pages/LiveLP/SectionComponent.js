import React, {useEffect, useState} from 'react';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';

const SectionComponent = ({page, section}) => {

    //const bgImage = section.type === "image" && section.image ? section.image : Vapor.asset('images/image-placeholder.jpg');

    const [bgStyle, setBgStyle] = useState(null);

    const {type, image, bg_color, button, button_position, button_link, text} = section;
    const {button_color, button_text_color, button_text} = page;

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

    return (
        <section className={type} style={ type === "text" ? { background: bg_color } : bgStyle }>
            {type === "text" &&
                <div className="container">
                    { (button && button_position === "above") ?
                        <div className={`button_wrap ${button_position}`}>
                            <a className={`button ${button_position}`}
                               style={{
                                   background: button_color,
                                   color: button_text_color
                               }}
                               href={button_link}
                            >
                                {button_text}
                            </a>
                        </div>
                        :
                        ""
                    }
                    <div dangerouslySetInnerHTML={createMarkup(text)}>
                    </div>
                    { (button && button_position === "below") ?
                        <div className={`button_wrap ${button_position}`}>
                            <a className={`button ${button_position}`}
                               style={{
                                   background: button_color,
                                   color: button_text_color
                               }}
                               href={button_link}
                            >
                                {button_text}
                            </a>
                        </div>
                        :
                        ""
                    }
                </div>
            }
            {type === "image" &&
                button ?
                    <div className={`button_wrap ${button_position}`}>
                        <a className="button"
                           style={{
                               background: button_color,
                               color: button_text_color
                           }}
                           href={button_link}
                        >
                            {button_text}
                        </a>
                    </div>
                    :
                    ""
            }
        </section>
    );
};

export default SectionComponent;
