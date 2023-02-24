import React, {useEffect, useState} from 'react';

const ColumnComponent = ({
                             sections,
                             section,
                             dataRow,
                             indexValue,
                             setIndexValue,
                             index,
                             column
}) => {

    const {id, type, text, text_color, video_title, video_link, background_color} = section;
    const [imagePlaceholder, setImagePlaceholder] = useState(null);
    const [mobileVideo, setMobileVideo] = useState(null);

    useEffect(() => {
        if (type === "video") {
            let split;
            if (video_link.includes('youtube')) {
                split = video_link.split("/embed/");
                setImagePlaceholder("https://img.youtube.com/vi/" + split[1] +
                    "/mqdefault.jpg");
            } else {
                split = video_link.split("/video/");
                setImagePlaceholder("https://vumbnail.com/" + split[1] + ".jpg")
            }
        }
    },[])

    useEffect(() => {

        function handleResize() {

            if (window.innerWidth < 551) {
                setIndexValue(null);
            } else {
                setMobileVideo(null);
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    },[])

    const handleOnClick = (e) => {
        e.preventDefault();
        const clickedDiv = e.currentTarget.parentNode
        //const videoUrl = clickedDiv.firstChild.dataset.video;

        if(window.innerWidth < 551) {
            setMobileVideo(true);
        } else {
            if (clickedDiv.classList.contains('open')) {
                setIndexValue(null);
            } else {
                setIndexValue(clickedDiv.firstChild.dataset.index);
                setTimeout(function(){
                    document.querySelector('.video_viewer').scrollIntoView({
                        behavior: 'smooth',
                        block: "nearest",
                    });

                }, 600)
            }
        }

        /*if (clickedDiv.classList.contains('open')) {
            document.querySelector('.folder').remove();
        } else {
            setIndexValue(index);

            if (clickedDiv.classList.contains('end_column')) {

                const parentDiv = document.createElement("div");
                parentDiv.className = "my_row open folder";
                const videoWrapper = document.createElement("div");
                videoWrapper.className = "video_wrapper";
                const iframe = document.createElement("iframe");
                iframe.src = video_link;
                iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;";
                iframe.allowFullscreen = true;
                videoWrapper.appendChild(iframe);
                parentDiv.appendChild(videoWrapper);

                clickedDiv.after(parentDiv)
            }
        }*/
        /*if (clickedDiv.classList.contains('open')) {
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
        }*/
    }

    return (
        <>
            <div className={`column ${type} ${index == indexValue ? "open" : ""}
                ${(column === 3 || sections[index + 1]?.type === "text") ? "end_column" : ""}`
            } style={{background: background_color}}>
                {type === "video" &&

                    mobileVideo ?
                        <div className="my_row folder open">
                            <div className="video_wrapper">
                                <iframe src={video_link}></iframe>
                            </div>
                        </div>
                        :
                        <a className="my_row" href="#"
                           data-video={video_link}
                           data-index={index}
                           data-row={dataRow}
                           data-column={column}
                           onClick={(e) => handleOnClick(
                               e)}>
                             <span className="image_wrap my_row">
                                <img src={imagePlaceholder} alt=""/>
                             </span>
                        </a>

                }
                <div className="my_row text_wrap">
                    {type === "video" &&
                        <h3 style={{color: text_color}}>{video_title}</h3>}
                    <p style={{color: text_color}}>{text}</p>
                </div>

                <div className="triangle"></div>
            </div>

            {/*{type === "video" &&
                <VideoComponent
                    section={section}
                    indexValue={indexValue}
                    dataRow={dataRow}
                    row={row}
                    iframeRef={iframeRef}
                    index={index}
                />
            }*/}
        </>

    );
};

export default ColumnComponent;
