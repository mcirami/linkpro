import React from 'react';

const VideoComponent = ({section, indexValue, dataRow, row, iframeRef, index}) => {

    return (
        <div ref={iframeRef} className={`my_row folder video_${index} ${indexValue == index ? "open" : ""}`}>
            <div className="video_wrapper">
                <iframe src="" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
            </div>
        </div>
    );
};

export default VideoComponent;
