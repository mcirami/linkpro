import React, {useContext, useState, useEffect} from 'react';
import {UserLinksContext, PageContext} from '../App';
import {IoIosLock, IoIosCloseCircleOutline} from 'react-icons/io';

const Preview = ({setRef, completedCrop, fileName, profileFileName, completedProfileCrop, profileRef, userSub}) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const {pageSettings, setPageSettings} = useContext(PageContext);
    const [iconCount, setIconCount] = useState(null);

    const myStyle = {
        background: "url(" + pageSettings["header_img"] + ") no-repeat",
        backgroundSize: "cover",
    };

    const ClosePreview = () => {
        document.querySelector('.links_col.preview').classList.remove('show');
        document.querySelector('body').classList.remove('fixed');
    }

    useEffect(() => {

        if (userSub) {
            const {braintree_status, ends_at, name} = {...userSub};
            const currentDate = new Date().valueOf();
            const endsAt = new Date(ends_at).valueOf();

            if (braintree_status === 'active' || braintree_status === 'pending' || endsAt > currentDate) {
                setIconCount(userLinks.length)
            } else {
                setIconCount(8)
            }
        } else {
            setIconCount(8)
        }

    }, [userLinks]);

    useEffect(() => {

        function handleResize() {
            const windowWidth = window.outerWidth;

            if (windowWidth > 992) {
                document.querySelector('.links_col.preview').
                    classList.
                    remove('show');
                document.querySelector('body').classList.remove('fixed');
            }
        }

        window.addEventListener('resize', handleResize);

        handleResize()
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const checkSubStatus = (icon) => {

        if (icon && icon.toString().includes('custom')) {
            if (userSub) {
                const {braintree_status, ends_at} = {...userSub};
                const currentDate = new Date().valueOf();
                const endsAt = new Date(ends_at).valueOf();

                if ((braintree_status === 'active' || braintree_status === 'pending') || endsAt > currentDate) {
                    return icon;
                } else {
                    return null;
                }
            }
        } else {
            return icon;
        }
    }

    return (

        <>
            <div className="close_preview" onClick={ClosePreview}>
                <IoIosCloseCircleOutline/>
            </div>

            <div className="links_wrap preview">
                <div className="inner_content" id="preview_wrap">
                    <div className="inner_content_wrap">
                        {!pageSettings["header_img"] && !fileName ?
                            <div className="page_header default">
                                <img src={ Vapor.asset("images/default-img.png") } alt=""/>
                            </div>
                            :
                            ""
                        }

                        {pageSettings["header_img"] && !fileName ?
                            <div className="page_header" style={myStyle}>
                            </div>
                            :
                            <div className="page_header canvas"
                                 style={{
                                     width: completedCrop ? `100%` : 0,
                                     height: completedCrop ? `auto` : 0,
                                 }}>
                                <canvas
                                    ref={setRef}
                                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                    style={{
                                        backgroundImage: setRef,
                                        /*width: Math.round(completedCrop?.width ?? 0),
                                        height: Math.round(completedCrop?.height ?? 0)*/
                                        width: completedCrop ? `100%` : 0,
                                        height: completedCrop ? `auto` : 0,
                                        borderTopRightRadius: `12%`,
                                        borderTopLeftRadius: `12%`,
                                    }}
                                />
                            </div>
                        }

                        <div className="profile_content">
                            {pageSettings["is_protected"] ?
                                <span className="lock_icon">
                                    <span className="tooltip_icon">
                                        ?
                                        <p className="tooltip">
                                            Link is password protected
                                        </p>
                                    </span>
                                    <IoIosLock/>

                                </span>
                                :
                                ""
                            }
                            <div className={pageSettings["profile_img"] &&
                            !profileFileName || profileFileName ?
                                "profile_img_column" :
                                "profile_img_column default"}>
                                {!profileFileName ?
                                    <div className="profile_image">
                                        <div className="image_wrap">
                                            <img src={pageSettings["profile_img"] ||
                                            Vapor.asset("images/default-img.png") } alt=""/>
                                        </div>
                                    </div>
                                    :
                                    <div className={profileFileName ?
                                        "profile_image selected" :
                                        "profile_image"}>
                                        <div className="image_wrap">
                                            <canvas
                                                ref={profileRef}
                                                // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                                style={{
                                                    backgroundImage: profileRef,
                                                    backgroundSize: `cover`,
                                                    backgroundRepeat: `no-repeat`,
                                                    /*width: Math.round(completedCrop?.width ?? 0),
                                                    height: Math.round(completedCrop?.height ?? 0)*/
                                                    width: completedProfileCrop ?
                                                        `100%` :
                                                        0,
                                                    height: completedProfileCrop ?
                                                        `100%` :
                                                        0,
                                                    borderRadius: `50px`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="profile_text">
                                <h2>{pageSettings["title"] || "Add Title"}</h2>
                                <p>{pageSettings["bio"] ||
                                "Add Bio or Slogan"}</p>
                            </div>
                        </div>
                        <div className="icons_wrap">

                            {userLinks.slice(0, iconCount).map((linkItem) => {

                                const {
                                    id,
                                    name,
                                    url,
                                    email,
                                    phone,
                                    icon,
                                    active_status
                                } = linkItem;
                                let source;
                                if (email) {
                                    source = "mailto:" + email;
                                } else if (phone) {
                                    source = "tel:" + phone;
                                } else {
                                    source = url;
                                }

                                const displayIcon = checkSubStatus(icon);

                                return (
                                    <div className="icon_col" key={id.toString()}>
                                        {active_status ?
                                            <>
                                                <a className={!source || !displayIcon ? "default" : ""} target="_blank" href={source ||
                                                "#"}>
                                                    <img src={displayIcon ||
                                                    Vapor.asset('images/icon-placeholder-preview.png') } alt=""/>
                                                </a>
                                                <p>{name || "Link Name"}</p>
                                            </>
                                            :
                                            ""
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Preview;

