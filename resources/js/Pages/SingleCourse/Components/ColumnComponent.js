import React, {useEffect, useState} from 'react';
const hasCourseAccess = user.hasCourseAccess;
const creator = user.creator;
const affRef = user.affRef;
const clickId = user.clickId;

const ColumnComponent = ({
                             section,
                             dataRow,
                             indexValue,
                             setIndexValue,
                             index,
                             course,
                             setPurchasePopup
}) => {

    const {id, type, text, text_color, video_title, video_link, background_color, button, button_position} = section;
    const {button_color, button_text_color, button_text, slug} = course;

    let additionalVars = "";
    if (affRef && clickId) {
        additionalVars = "?a=" + affRef + "&cid=" + clickId;
    }
    const buttonUrl = window.location.protocol + "//" + window.location.host + "/" + creator + "/course/" + slug + "/checkout" + additionalVars;

    const [imagePlaceholder, setImagePlaceholder] = useState(null);
    const [mobileVideo, setMobileVideo] = useState(null);
    const [buttonStyle, setButtonStyle] = useState(null);

    console.log("affRef: ", affRef);
    console.log("clickId: ", clickId);

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

    useEffect(() => {

        if(button) {
            setButtonStyle({
                background: button_color || '#000000',
                color: button_text_color || '#ffffff'
            })
        }

    },[])

    const handleOnClick = (e) => {
        e.preventDefault();


        if(hasCourseAccess) {
            const clickedDiv = e.currentTarget.parentNode

            if (window.innerWidth < 551) {
                setMobileVideo(true);
            } else {
                if (clickedDiv.classList.contains('open')) {
                    setIndexValue(null);
                } else {
                    setIndexValue(clickedDiv.firstChild.dataset.index);
                    setTimeout(function() {
                        document.querySelector('.video_viewer').scrollIntoView({
                            behavior: 'smooth',
                            block: "nearest",
                        });

                    }, 600)
                }
            }
        } else {
            handleOverlayClick()
        }
    }

    const handleOverlayClick = () => {
        setPurchasePopup({
            show: true,
            button_color: button_color || "#000000",
            button_text_color: button_text_color || '#ffffff',
            button_text: button_text || 'Buy Course',
            button_link: buttonUrl
        })
    }

    const Button = () => {
        return (
            <div className={`button_wrap ${button_position ? button_position : "above"}`}>
                <a href={buttonUrl}
                   target="_blank"
                   className="button"
                   style={buttonStyle}
                >{button_text || "Get Course"}</a>
            </div>
        )
    }

    return (

        <div className={`column ${type} ${index == indexValue ? "open" : ""}`}
             style={{background: background_color}}>

            {type === "video" ?

                mobileVideo ?
                    <div className="my_row folder open">
                        <div className="video_wrapper">
                            <iframe src={video_link} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
                        </div>
                    </div>
                    :
                    <a className="my_row" href="#"
                       data-video={video_link}
                       data-index={index}
                       data-row={dataRow}
                       onClick={(e) => handleOnClick(
                           e)}>
                         <span className="image_wrap my_row">
                            <img src={imagePlaceholder} alt=""/>
                         </span>
                    </a>

                :
                ""
            }
            <div className="my_row text_wrap">
                {type === "video" &&
                    <h3 style={{color: text_color}}>{video_title}</h3>
                }

                { !hasCourseAccess &&
                    (button && button_position === "above") ?
                        <Button />
                        :
                        ""
                }
                <p style={{color: text_color}}>{text}</p>
                { !hasCourseAccess &&
                    (button && button_position === "below") ?
                            <Button />
                        :
                        ""
                }
            </div>
            { (!hasCourseAccess && type === "video") ?
                <span className="overlay" onClick={handleOverlayClick}></span>
                :
                ""
            }
        </div>


    );
};

export default ColumnComponent;