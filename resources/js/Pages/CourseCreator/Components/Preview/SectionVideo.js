import React from 'react';

const SectionVideo = ({
                          title,
                          link,
                          text,
                          textColor
}) => {

    return (
        <>
            {link ?
                <div className="video_wrapper">
                    <iframe src={link}></iframe>
                </div>
                :
                <img src={ Vapor.asset('images/image-placeholder.jpg')} alt=""/>
            }

            <div className="text_wrap">
                <h3 style={{color: textColor || "rgba(0,0,0,1)" }}>{title || "Video Title"}</h3>

                {text &&
                    <p style={{color: textColor || "rgba(0,0,0,1)"}}>{text}</p>
                }
            </div>
        </>
    );
};

export default SectionVideo;
