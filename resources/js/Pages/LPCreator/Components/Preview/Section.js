import React, {useEffect, useState} from 'react';

const Section = ({colors, data, textArray}) => {

    const {type, position, bgColor, textColor, text, imgUrl} = data;

    return (
        <section className="my_row">
            {{
                "text":
                    <div className={type} style={{ background: colors["section" + position + "BgColor"] || bgColor}}>
                        <div className="container">
                            <p
                                style={{ color: colors["section" + position + "TextColor"] || textColor}}
                            >{textArray["section" + position + "Text"] || text}</p>
                        </div>
                    </div>,
                "image":
                    <div className={type} >
                        <img src={imgUrl} alt=""/>
                    </div>,
            }[type]}
        </section>
    );
};

export default Section;
