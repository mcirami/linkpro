import React, {
    useContext,
    useState,
    useEffect,
    useLayoutEffect,
    useRef,
} from 'react';
import {UserLinksContext, PageContext} from '../App';
import {IoIosLock, IoIosCloseCircleOutline} from 'react-icons/io';
import {BiHelpCircle} from 'react-icons/bi';
import FolderLinks from './FolderLinks';
import AccordionLinks from './AccordionLinks';
import {checkIcon, checkSubStatus} from '../../../../Services/UserService';

const Preview = ({
                     setRef,
                     completedCrop,
                     fileName,
                     profileFileName,
                     completedProfileCrop,
                     profileRef,
                     row,
                     setRow,
                     value,
                     setValue
}) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const {pageSettings, setPageSettings} = useContext(PageContext);
    const [iconCount, setIconCount] = useState(null);
    const [subStatus, setSubStatus] = useState(checkSubStatus());

    const myStyle = {
        background: "url(" + pageSettings["header_img"] + ") no-repeat",
        backgroundSize: "cover",
    };

    const ClosePreview = () => {
        document.querySelector('.links_col.preview').classList.remove('show');
        document.querySelector('body').classList.remove('fixed');
    }

    useEffect(() => {

        if (subStatus) {
            setIconCount(userLinks.length)
        } else {
            setIconCount(8);
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

    useLayoutEffect(() => {

        function handleResize() {
            const windowWidth = window.outerWidth;

            const box = document.querySelector('.inner_content_wrap');
            const innerContent = document.getElementById('preview_wrap');

            let pixelsToMinus;
            if (windowWidth > 551) {
                pixelsToMinus = 35;
            } else {
                pixelsToMinus = 25;
            }

            box.style.maxHeight = innerContent.offsetHeight - pixelsToMinus + "px";
        }

        window.addEventListener('resize', handleResize);

        handleResize()
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useLayoutEffect(() => {
        const box = document.querySelector('.inner_content_wrap');
        const innerContent = document.getElementById('preview_wrap');

        let pixelsToMinus = 0;
        if (window.outerWidth > 550) {
            pixelsToMinus = 35;
        } else {
            pixelsToMinus = 25;
        }

        box.style.maxHeight = innerContent.offsetHeight - pixelsToMinus + "px";
    }, []);

    const folderClick = (e, index) => {
        e.preventDefault();

        const clickedDiv = e.currentTarget.parentNode;

        if (clickedDiv.classList.contains('open')) {
            setRow(null);
            setValue(null);
        } else {
            setRow(clickedDiv.firstChild.dataset.row);
            setValue(index);
        }
    }

    let folderCount = 0;

    const accordionLinks = value !== null ? userLinks[value].links : null;

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
                                        <BiHelpCircle />
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
                                    <div className={"profile_image"}>
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
                        <div className="icons_wrap main">

                            {userLinks.slice(0, iconCount).map(( linkItem, index ) => {

                                let {
                                    id,
                                    type,
                                    name,
                                    url,
                                    email,
                                    phone,
                                    icon,
                                    active_status,
                                    links
                                } = linkItem;

                                if (email) {
                                    url = "mailto:" + email;
                                } else if (phone) {
                                    url = "tel:" + phone;
                                }

                                const dataRow = Math.ceil((index + 1) / 4);

                                let displayIcon = null;
                                if(!type) {
                                    displayIcon = checkIcon(icon, "preview");
                                }

                                let colClasses = "";
                                if (type === "folder") {
                                    colClasses = "icon_col folder";
                                    ++folderCount;
                                } else {
                                    colClasses = "icon_col";
                                }

                                return (
                                    <React.Fragment key={index}>

                                        {type === "folder" ?
                                            active_status && subStatus ?
                                                <div className={ ` ${colClasses} ${index == value ? " open" : "" } `}>
                                                    <a className="inner_icon_wrap" href="#" data-row={ dataRow } onClick={(e) => {folderClick(e, index)} }>
                                                        <img className="bg_image" src={ Vapor.asset('images/blank-folder-square.jpg') } alt=""/>
                                                        <div className="folder_icons preview">
                                                            {links.slice(0, 9).map(( innerLinkIcons, index ) => {
                                                                return (
                                                                    <FolderLinks key={index} icons={innerLinkIcons} />
                                                                )
                                                            })}

                                                        </div>
                                                    </a>
                                                    <p>
                                                        {name && name.length >
                                                        11 ?
                                                            name.substring(0,
                                                                11) + "..."
                                                            :
                                                            name || "Link Name"
                                                        }
                                                    </p>
                                                </div>
                                                :
                                                subStatus && <div className={ ` ${colClasses} `}>
                                                </div>
                                            :

                                            active_status ?
                                                <div className={ ` ${colClasses} `}>
                                                    <a className={!url ||
                                                    !displayIcon ?
                                                        "default" :
                                                        ""} target="_blank" href={url ||
                                                    "#"}>
                                                        <img src={displayIcon} alt=""/>
                                                    </a>
                                                    <p>
                                                        {name && name.length >
                                                        11 ?
                                                            name.substring(0,
                                                                11) + "..."
                                                            :
                                                            name || "Link Name"
                                                        }
                                                    </p>
                                                </div>
                                                :
                                                ""
                                        }

                                        {(index + 1) % 4 === 0 || index + 1 === iconCount ?
                                            <div className={`my_row folder ${dataRow == row ? "open" : ""}`} >
                                                <div className="icons_wrap inner">
                                                    {accordionLinks && dataRow == row ? accordionLinks.map((innerLinkFull, index) => {
                                                        return (
                                                            <AccordionLinks key={index} icons={innerLinkFull} />
                                                        )
                                                    })
                                                    :
                                                        ""
                                                    }
                                                </div>
                                            </div>
                                            :
                                            ""
                                        }
                                    </React.Fragment>
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

