import React from 'react';

const VideoComponent = ({sections, indexValue, dataRow, row}) => {

    return (
        <div className={`my_row folder ${dataRow == row ? "open" : ""}`}>
            { sections[indexValue] ?
                <div className="video_wrapper">
                    <iframe src={sections[indexValue].video_link} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
                </div>
                :
                ""
            }
        </div>
    );
};

export default VideoComponent;
