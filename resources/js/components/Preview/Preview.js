import React, {useContext} from 'react';
import {MdEdit} from "react-icons/md";
import {LinksContext, PageContext} from '../App';
import {MdCancel} from 'react-icons/md';

//const page_header_path  = user.page_header_path + "/";
//const page_profile_path  = user.page_profile_path + "/";

const Preview = ({ userLinks, setRef, completedCrop, fileName, profileFileName, completedProfileCrop, profileRef }) => {

    //const { userLinks } = useContext(LinksContext);
    const { pageSettings, setPageSettings } = useContext(PageContext);

    const myStyle = {
        background: "url(" + pageSettings["header_img"] + ") no-repeat",
        backgroundSize: "cover",
    };

    const ClosePreview = () => {
        document.querySelector('.links_col.preview').classList.remove('show');
    }

    return (

        <>
            <div className="close_preview" onClick={ClosePreview}>
                <MdCancel />
            </div>
            <div className="links_wrap preview">
                <div className="inner_content">
                    {!pageSettings["header_img"] && !fileName ?
                        <div className="page_header default"
                             style={myStyle}
                        >
                            <MdEdit />
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
                        {!pageSettings["profile_img"] && !profileFileName ?
                            <div className="profile_image default">
                                <div className="image_wrap">
                                    <MdEdit />
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
                            <h2>{pageSettings["title"]}</h2>
                            <p>{pageSettings["bio"]}</p>
                        </div>
                    </div>
                    <div className="icons_wrap">
                        {userLinks.map((linkItem) => {
                            const { id, url, icon, active_status } = linkItem;
                            return (
                                <>
                                    { active_status ?
                                        <div className="icon_col" key={ id || Math.random()}>
                                            <a target="_blank" href={url}>
                                                <img src={icon} />
                                            </a>
                                        </div>
                                     :
                                        /*<div className="icon_col" key={ id || Math.random()}>
                                            <div className="column_content">
                                                <MdEdit />
                                            </div>
                                        </div>*/
                                        ""
                                    }
                                 </>
                            )
                        })}
                        {/*{count < 9 ?
                            <DefaultIcon count={count}
                                         defaultIconPath={defaultIconPath}
                                        />
                            : ""
                        }*/}
                    </div>
                </div>
            </div>
        </>
    );
}

/*
const DefaultIcon = ({count, defaultIconPath}) => {

    let n = 9 - count;
    return (
        <>
            {_.times( n, () =>

                <div className="icon_col disabled" key={n}>
                    <a target="_blank" href={null}>
                        <img src={defaultIconPath} />
                    </a>
                </div>
            )}
        </>

    )
}
*/


export default Preview;
