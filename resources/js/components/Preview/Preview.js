import React, {useContext, useState, useEffect} from 'react';
import {LinksContext, PageContext} from '../App';
import {MdCancel} from 'react-icons/md';
import {IoIosLock} from 'react-icons/io';

//const page_header_path  = user.page_header_path + "/";
//const page_profile_path  = user.page_profile_path + "/";

const Preview = ({ userLinks, setRef, completedCrop, fileName, profileFileName, completedProfileCrop, profileRef, userSub }) => {

    //const { userLinks } = useContext(LinksContext);
    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [ iconCount, setIconCount ] = useState(null);

    const myStyle = {
        background: "url(" + pageSettings["header_img"] + ") no-repeat",
        backgroundSize: "cover",
    };

    const ClosePreview = () => {
        document.querySelector('.links_col.preview').classList.remove('show');
    }

    useEffect(()=> {

        if (userSub) {
            const {braintree_status, ends_at, name} = {...userSub};
            const currentDate = new Date().valueOf();
            const endsAt = new Date(ends_at).valueOf();

            if (braintree_status === 'active' || endsAt > currentDate) {
                setIconCount(userLinks.length)
            } else {
                setIconCount(9)
            }
        } else {
            setIconCount(9)
        }

    }, [userLinks])

    return (

        <>
            <div className="close_preview" onClick={ClosePreview}>
                <MdCancel />
            </div>

            <div className="links_wrap preview">
                <div className="inner_content" id="preview_wrap">
                    <div className="inner_content_wrap">
                        {!pageSettings["header_img"] && !fileName ?
                            <div className="page_header default">
                                <img src="/images/default-img.png" alt=""/>
                            </div>
                            :
                            ""
                        }

                        {pageSettings["header_img"] && !fileName ?
                            <div className="page_header" style={myStyle} >
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
                            {!pageSettings["profile_img"] && !profileFileName ?
                                <div className="profile_image default">
                                    <div className="image_wrap">
                                        <img src="/images/default-img.png" alt=""/>
                                    </div>
                                </div>
                                :
                                ""
                            }

                            {pageSettings["profile_img"] && !profileFileName ?
                                <div className="profile_image">
                                    <div className="image_wrap">
                                        <img src={pageSettings["profile_img"]} alt=""/>
                                    </div>
                                </div>
                                :
                                <div className={!pageSettings["profile_img"] && !profileFileName ?  "" : "profile_image" }>
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
                                                width: completedProfileCrop ? `100%` : 0,
                                                height: completedProfileCrop ? `100%` : 0,
                                                borderRadius: `50px`,
                                            }}
                                        />
                                    </div>
                                </div>
                            }
                            <div className="profile_text">
                                <h2>{pageSettings["title"] || "Add Link Title Here"}</h2>
                                <p>{pageSettings["bio"] || "Add Slogan/Bio Intro Here"}</p>
                            </div>
                        </div>
                        <div className="icons_wrap">

                            {userLinks.slice(0, iconCount).map((linkItem) => {

                                const { id, name, url, icon, active_status } = linkItem;
                                return (
                                    <div className="icon_col" key={id.toString()}>
                                        { active_status ?
                                            <>
                                                <a target="_blank" href={ url || "https://link.pro"}>
                                                    <img src={ icon || '/images/icon-placeholder-preview.png'} alt=""/>
                                                </a>
                                                <p>{ name || "Link Name" }</p>
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

