import React, {
    useContext,
    useState,
    useEffect,
    useLayoutEffect,
    useRef,
} from 'react';
import {UserLinksContext, PageContext} from '../App';
import {IoIosLock, IoIosCloseCircleOutline} from 'react-icons/io';

const Preview = ({
                     setRef,
                     completedCrop,
                     fileName,
                     profileFileName,
                     completedProfileCrop,
                     profileRef,
                     userSub,
                     folderContent,
                     setFolderContent
}) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const {pageSettings, setPageSettings} = useContext(PageContext);
    const [iconCount, setIconCount] = useState(null);
    const [row, setRow] = useState(null);

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

            const box = document.querySelector('.inner_content_wrap');
            const innerContent = document.getElementById('preview_wrap');

            let pixelsToMinus = 0;
            if (windowWidth > 550) {
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

    useLayoutEffect(() => {

        function handleResize() {
            const windowWidth = window.outerWidth;

            const box = document.querySelector('.inner_content_wrap');
            const innerContent = document.getElementById('preview_wrap');

            let pixelsToMinus = 0;
            if (windowWidth > 550) {
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

    const folderClick = e => {
        e.preventDefault();

        const clickedDiv = e.currentTarget;

        if (clickedDiv.classList.contains('open')) {
            clickedDiv.classList.remove('open');
            document.querySelectorAll('.my_row.folder.open').forEach((element) => {
                element.classList.remove('open');

                setTimeout(() => {
                    element.classList.remove('adjust');
                }, 200)
            })
            setTimeout(() => {
                clickedDiv.lastElementChild.after(folderContent);
                setFolderContent(null);
            }, 500)

            setRow(null);
        } else if (folderContent) {
            const folder = document.querySelector('.my_row.folder.open');
            setTimeout(() => {
                folder.classList.remove('open');
            }, 100)

            const folderParent = document.querySelector(folder.dataset.parent);
            folderParent.classList.remove('open');
            setTimeout(() => {
                folder.classList.remove('adjust');
            }, 200)

            setTimeout(() => {
                folderParent.lastElementChild.after(folder);
            }, 500)

            insertFolder(e);

        } else {
            insertFolder(e);
        }
    }

    const insertFolder = (event) => {
        const clickedDiv = event.currentTarget;
        const currentRow = clickedDiv.firstChild.dataset.row;
        const nthChild = currentRow * 4;
        setRow(currentRow);

        const content = clickedDiv.lastElementChild;

        let iconRow = null;
        if (nthChild > userLinks.length) {
            iconRow  = document.querySelector('.icons_wrap.main > .icon_col:last-child');
        } else {
            iconRow  = document.querySelector('.icons_wrap.main > .icon_col:nth-child(' + nthChild + ')');
        }

        iconRow.after(content);

        if (!row || row !== currentRow) {
            setTimeout(() => {
                content.classList.add('open');
                clickedDiv.classList.add('open');
            }, 100)

            setTimeout(() => {
                content.classList.add('adjust');
            }, 200)
        } else {
            content.classList.add('open');
            clickedDiv.classList.add('open');
            content.classList.add('adjust');
        }

        setFolderContent(content);
    }

    let folderCount = 0;

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
                                    <div className={ profileFileName ?
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
                                let source;
                                if (email) {
                                    source = "mailto:" + email;
                                } else if (phone) {
                                    source = "tel:" + phone;
                                } else {
                                    source = url;
                                }

                                let dataRow = Math.ceil((index + 1) / 4);

                                const displayIcon = checkSubStatus(icon);

                                {type === "folder" && ++folderCount}

                                return (

                                    <>
                                        {type === "folder" ?

                                            <div id={"folder" + folderCount +
                                            "Parent"} className="icon_col folder" onClick={(e) => {folderClick(e)} } key={id}>
                                                {active_status ?
                                                    <>
                                                        <a type="button" href="#" data-row={ dataRow }>
                                                            <img className="bg_image" src={ Vapor.asset('images/blank-folder-square.jpg') } alt=""/>
                                                            <div className="icons_wrap">
                                                                {links.slice(0, 9).map(( link, index ) => {
                                                                    const displayIcon = checkSubStatus(link.icon);
                                                                    return (
                                                                        <div className="icon_col" key={index}>
                                                                            {link.active_status &&
                                                                                <img src={displayIcon} alt={link.name} title={link.name}/>
                                                                            }
                                                                        </div>
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
                                                        <div id={"folder" + folderCount} className="my_row folder" data-parent={"#folder" + folderCount + "Parent"}>
                                                            <div className="icons_wrap inner">
                                                                {links.map((link) => {
                                                                    let source;
                                                                    if (link.email) {
                                                                        source = "mailto:" + link.email;
                                                                    } else if (link.phone) {
                                                                        source = "tel:" + link.phone;
                                                                    } else {
                                                                        source = link.url;
                                                                    }
                                                                    return (
                                                                        <div className="icon_col" key={link.id}>
                                                                            {link.active_status &&
                                                                                <>
                                                                                    <a href={source} target="_blank">
                                                                                        <img src={link.icon} alt={link.name} title={link.name}/>
                                                                                    </a>
                                                                                    <p>
                                                                                        {link.name && link.name.length >
                                                                                        11 ?
                                                                                            link.name.substring(0,
                                                                                                11) + "..."
                                                                                            :
                                                                                            link.name || "Link Name"
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            }
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    ""
                                                }
                                            </div>

                                            :

                                            <div className="icon_col" key={id}>
                                                {active_status ?
                                                    <>
                                                        <a className={!source ||
                                                        !displayIcon ?
                                                            "default" :
                                                            ""} target="_blank" href={source ||
                                                        "#"}>
                                                            <img src={displayIcon ||
                                                            Vapor.asset(
                                                                'images/icon-placeholder-preview.png')} alt=""/>
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
                                                    </>
                                                    :
                                                    ""
                                                }
                                            </div>
                                        }
                                    </>
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

