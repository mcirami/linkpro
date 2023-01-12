import React from 'react';

const SectionVideo = ({
                          title,
                          link,
                          text,
                          textColor
}) => {

    return (
        <>
            <h3 style={{color: textColor || "rgba(0,0,0,1)" }}>{title || "Video Title"}</h3>

            {link ?
                <div className="video_wrapper">
                    <iframe src={link}></iframe>
                </div>
                :
                <img src={ Vapor.asset('images/image-placeholder.jpg')} alt=""/>
            }

            {text &&
                <p style={{color: textColor || "rgba(0,0,0,1)"}}>{text}</p>
            }
        </>
    );
};

export default SectionVideo;
