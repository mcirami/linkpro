import React, {useRef} from 'react';
import VideoComponent from './VideoComponent';

const ColumnComponent = ({
                             section,
                             dataRow,
                             row,
                             setRow,
                             indexValue,
                             setIndexValue,
                             index,
}) => {

    const {id, type, text, text_color, video_title, video_link, background_color} = section;

    const iframeRef = useRef();

    const handleOnClick = (e) => {
        e.preventDefault();
        const clickedDiv = e.currentTarget.parentNode
        const videoUrl = clickedDiv.firstChild.dataset.video;
        const index = clickedDiv.firstChild.dataset.index;

        if (clickedDiv.classList.contains('open')) {
            setIndexValue(null)
        } else {
            document.querySelector('.video_' + index + ' iframe' ).src = videoUrl;
            setIndexValue(index);

            setTimeout(function(){
                document.querySelector('.my_row.folder.open').scrollIntoView({
                    behavior: 'smooth',
                    block: "nearest",
                });

            }, 800)
        }
    }

    return (
        <>
            <div className={`column ${type} ${index ==  indexValue ? "open" : "" }`} style={{ background: background_color }}>
                {type === "video" &&
                    <a className="my_row" href="#" data-video={video_link} data-index={index} data-row={dataRow} onClick={(e) => handleOnClick(e)}>
                         <span className="image_wrap my_row">
                            <img src={Vapor.asset('images/image-placeholder.jpg')} alt=""/>
                         </span>
                    </a>
                }
                <div className="my_row text_wrap">
                    {type === "video" && <h3 style={{color: text_color}}>{video_title}</h3>}
                    <p style={{color: text_color}}>{text}</p>
                </div>

                <div className="triangle"></div>
            </div>
            {type === "video" &&
                <VideoComponent
                    section={section}
                    indexValue={indexValue}
                    dataRow={dataRow}
                    row={row}
                    iframeRef={iframeRef}
                    index={index}
                />
            }
        </>

    );
};

export default ColumnComponent;
