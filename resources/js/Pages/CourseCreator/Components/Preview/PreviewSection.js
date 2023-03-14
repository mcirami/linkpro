import React, {useEffect, useState} from 'react';
import SectionVideo from './SectionVideo';

const PreviewSection = ({
                            currentSection,
                            position,
                            courseData,
                            index,
                            url
}) => {


    const {type, background_color, text_color, text, video_title, video_link, button, button_position} = currentSection;
    const [buttonStyle, setButtonStyle] = useState(null);

    useEffect(() => {
        setButtonStyle ({
            background: courseData["button_color"],
            color: courseData["button_text_color"]
        })

    },[courseData["button_color"], courseData["button_text"]])

    const Button = ({buttonText}) => {
        return (
            <div className={`button_wrap ${button_position ? button_position : "above"}`}>
                <a href={`${url}/checkout`}
                   target="_blank"
                   className="button"
                   style={buttonStyle}
                >{buttonText || "Get Course"}</a>
            </div>
        )
    }

    return (
        <section className={type} style={{ background: background_color || 'rgba(255,255,255,1)'}}>
            {( !!button && button_position === "above") &&
                <Button
                    buttonText={courseData["button_text"]}
                />
            }
            {{
                "text":
                    <p
                        style={{ color: text_color || 'rgba(0,0,0,1)'}}
                    >{text || ""}</p>
                    ,
                "video":
                    <SectionVideo
                        title={video_title}
                        link={video_link}
                        text={text}
                        textColor={text_color}
                        index={index}

                    />,
            }[type]}
            {( !!button && button_position === "below") &&
                <Button
                    buttonText={courseData["button_text"]}
                />
            }
        </section>
    );
};

export default PreviewSection;
