import React, {
    useContext,
    useState,
    useEffect,
    useLayoutEffect,
} from 'react';
import {PageContext, UserLinksContext} from '../../App';
import {IoIosCloseCircleOutline} from 'react-icons/io';
import AccordionLinks from './AccordionLinks';
import {checkIcon} from '../../../../Services/UserService';
import Header from './Header';
import ProfileImage from './ProfileImage';
import ProfileText from './ProfileText';
import Folder from './Folder';
import LockIcon from './LockIcon';

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
                     setValue,
                     subStatus,
                     pageHeaderRef,
                     infoIndex,
                     setInfoIndex
}) => {

    const { userLinks } = useContext(UserLinksContext);
    const [iconCount, setIconCount] = useState(null);
    const {pageSettings} = useContext(PageContext);

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
                        {pageSettings["is_protected"] ?
                                <LockIcon infoIndex={infoIndex} setInfoIndex={setInfoIndex}/>
                            :
                            ""
                        }
                        <Header
                            setRef={setRef}
                            completedCrop={completedCrop}
                            fileName={fileName}
                        />

                        <div id={pageSettings['profile_layout']} className="profile_content" ref={pageHeaderRef}>
                            <ProfileImage
                                profileFileName={profileFileName}
                                completedProfileCrop={completedProfileCrop}
                                profileRef={profileRef}
                            />
                            <ProfileText />
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
                                    if(icon.includes("Facetime")) {
                                        url = 'facetime:' + phone;
                                    }
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
                                                <Folder
                                                    colClasses={colClasses}
                                                    mainIndex={index}
                                                    links={links}
                                                    setRow={setRow}
                                                    value={value}
                                                    setValue={setValue}
                                                    dataRow={dataRow}
                                                    name={name}
                                                />
                                                :
                                                subStatus && <div className={ ` ${colClasses} `}>
                                                </div>
                                            :
                                            <div className={ ` ${colClasses} `}>
                                                {active_status ?
                                                    <>
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
                                                    </>
                                                    :
                                                    ""
                                                }
                                            </div>
                                        }

                                        {subStatus &&
                                            <>
                                                {(index + 1) % 4 === 0 || index + 1 ===
                                                iconCount ?
                                                    <div className={`my_row folder ${dataRow == row ? "open" : ""}`}>
                                                        <div className="icons_wrap inner">
                                                            {accordionLinks && dataRow == row ?
                                                                accordionLinks.map((
                                                                    innerLinkFull,
                                                                    index) => {
                                                                    return (
                                                                        <AccordionLinks key={index} icons={innerLinkFull}/>
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
                                            </>
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

