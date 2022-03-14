import React, {
    useCallback,
    useRef,
    useEffect,
    useLayoutEffect,
    useState,
    useContext,
} from 'react';
import {MdDragHandle} from 'react-icons/md';
import Switch from "react-switch";
import {UserLinksContext, OriginalArrayContext, FolderLinksContext, OriginalFolderLinksContext} from '../App';
import {Motion, spring} from 'react-motion';
import {
    updateLinksPositions,
    updateLinkStatus,
    getColHeight,
    getColWidth,
} from '../../../../Services/LinksRequest';
import {checkIcon, checkSubStatus} from '../../../../Services/UserService';
import EventBus from '../../../../Utils/Bus';

const springSetting1 = { stiffness: 180, damping: 10 };
const springSetting2 = { stiffness: 120, damping: 17 };

function reinsert(arr, from, to) {
    const _arr = arr.slice(0);

    const val = _arr[from];
    _arr.splice(from, 1);
    _arr.splice(to, 0, val);
    return _arr;
}

function clamp(n, min, max) {
    return Math.max(Math.min(n, max), min);
}

const Links = ({
                   setEditID,
                   setEditFolderID,
                   setRow,
                   setValue,
                   setShowUpgradePopup,
                   setOptionText

}) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const { originalArray, setOriginalArray } = useContext(OriginalArrayContext);
    const { folderLinks, setFolderLinks } = useContext(FolderLinksContext);
    const { originalFolderLinks, setOriginalFolderLinks } = useContext(OriginalFolderLinksContext);
    const [subStatus, setSubStatus] = useState(checkSubStatus());

    const initialRender = useRef(true);
    const targetRef = useRef();

    const [size, setSize] = useState({
        height: 0,
        width: 0
    });

    useEffect(() => {

        setTimeout(() => {
            if (targetRef.current && userLinks.length > 0) {
                setSize({
                    height: getColHeight(),
                    width: getColWidth('main'),
                })
            }
        },500)
    }, [])

    const [state, setState] = useState(() => ({
        mouseXY: [0,0],
        mouseCircleDelta: [0,0], // difference between mouse and circle pos for x + y coords, for dragging
        lastPress: null,
        isPressed: false,
    }));

    useEffect(() => {

        setTimeout(() => {
            const iconsWrap = document.querySelector('.icons_wrap');
            const icons = document.querySelectorAll('.add_icons .icon_col');

            if (icons.length > 0) {
                const colHeight = icons[0].clientHeight;
                const rowCount = Math.ceil(icons.length / 4);
                let divHeight = rowCount * colHeight - 40;
                if (userLinks.length < 5) {
                    divHeight += 20;
                }
                iconsWrap.style.minHeight = divHeight + "px";
            } else {
                iconsWrap.style.minHeight = "200px";
            }
        },600)
    }, []);

    useEffect(() => {

        function handleResize() {

            const iconsWrap = document.querySelector('.icons_wrap');
            const icons = document.querySelectorAll('.add_icons .icon_col');

            if (icons.length > 0) {
                const colHeight = icons[0].clientHeight;
                const rowCount = Math.ceil(icons.length / 4);
                let divHeight = rowCount * colHeight - 40;
                if (userLinks.length < 5) {
                    divHeight += 20;
                }
                iconsWrap.style.minHeight = divHeight + "px";
            } else {
                iconsWrap.style.minHeight = "200px";
            }
        }

        window.addEventListener('resize', handleResize);
        //handleResize()

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    },[]);

    let [width, height] = [size.width, size.height];

    useEffect(() => {

        function handleResize() {
            setSize({
                height: getColHeight(),
                width: getColWidth('main'),
            })
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    // indexed by visual position
    const layout = userLinks.map((link, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        return [width * col, height * row];
    });

    const handleMouseDown = useCallback (
        (key, [pressX, pressY], { pageX, pageY }) => {
            setState((state) => ({
                ...state,
                lastPress: key,
                isPressed: true,
                mouseCircleDelta: [pageX - pressX, pageY - pressY],
                mouseXY: [pressX, pressY],
            }));
        },
        []
    );

    const handleTouchStart = useCallback(

        (key, pressLocation, e) => {
            e.preventDefault();
            handleMouseDown(key, pressLocation, e.touches[0]);
        },
        [handleMouseDown]
    );

    const handleMouseMove = useCallback(
        ({ pageX, pageY }) => {
            const {
                lastPress,
                isPressed,
                mouseCircleDelta: [dx, dy],
            } = state;

            if (isPressed) {
                const mouseXY = [pageX - dx, pageY - dy];
                const col = clamp(Math.floor(mouseXY[0] / width), 0, 3);
                const row = clamp(
                    Math.floor(mouseXY[1] / height),
                    0,
                    Math.floor(userLinks.length / 4)
                );
                let index = row * 4 + col;

                const newOrder = reinsert(
                    userLinks,
                    userLinks.findIndex((link) => link.position === lastPress),
                    index,
                );
                setState((state) => ({ ...state, mouseXY }));
                setUserLinks(newOrder);
            }
        },
        [state]
    );



    const handleTouchMove = useCallback((e) => {
            e.preventDefault();
            /*document.querySelector('body').classList.add('fixed');*/
            handleMouseMove(e.touches[0]);
        },
        [handleMouseMove]
    );

    const handleMouseUp = useCallback(() => {
        /*document.querySelector('body').classList.remove('fixed');*/
        setState((state) => ({
            ...state,
            isPressed: false,
            mouseCircleDelta: [0, 0]
        }));
    }, []);

    useEffect(() => {
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleTouchMove, handleMouseUp, handleMouseMove]);

    useEffect(() => {

        if (initialRender.current) {
            initialRender.current = false;
        } else if(!state.isPressed) {
            const packets = {
                userLinks: userLinks,
            }

            updateLinksPositions(packets);

        }

        if (state.isPressed) {
            setRow(null)
            setValue(null)
        }

    }, [state.isPressed]);

    const handleChange = (currentItem, hasLinks, type) => {

        if(hasLinks) {

            if ((currentItem.type && currentItem.type === "folder") && !subStatus) {
                const popup = document.querySelector('#upgrade_popup');
                setShowUpgradePopup(true);
                popup.classList.add('open');
                setOptionText("enable your folders");

                setTimeout(() => {
                    document.querySelector('#upgrade_popup .close_popup').addEventListener('click', function(e) {
                        e.preventDefault();
                        setShowUpgradePopup(false);
                        popup.classList.remove('open');
                    });
                }, 300);


            } else {
                const newStatus = !currentItem.active_status;

                let url = "";

                if (currentItem.type && currentItem.type === "folder") {
                    url = "/dashboard/folder/status/";
                } else {
                    url = "/dashboard/links/status/"
                }

                const packets = {
                    active_status: newStatus,
                };

                updateLinkStatus(packets, currentItem.id, url).then((data) => {

                    if (data.success) {

                        if (type === "folder") {
                            setOriginalArray(
                                originalArray.map((item) => {
                                    if (item.id === currentItem.id && type ===
                                        "folder") {
                                        return {
                                            ...item,
                                            active_status: newStatus,
                                        };
                                    }
                                    return item;
                                })
                            )
                            setUserLinks(
                                userLinks.map((item) => {
                                    if (item.id === currentItem.id && type ===
                                        "folder") {
                                        return {
                                            ...item,
                                            active_status: newStatus,
                                        };
                                    }
                                    return item;
                                })
                            )
                        } else {
                            setOriginalArray(
                                originalArray.map((item) => {
                                    if (item.id === currentItem.id && type !==
                                        "folder") {
                                        return {
                                            ...item,
                                            active_status: newStatus,
                                        };
                                    }
                                    return item;
                                })
                            )
                            setUserLinks(
                                userLinks.map((item) => {
                                    if (item.id === currentItem.id && type !==
                                        "folder") {
                                        return {
                                            ...item,
                                            active_status: newStatus,
                                        };
                                    }
                                    return item;
                                })
                            )
                        }

                    }
                })
            }
        } else {
            EventBus.dispatch("error", {message: "Add Icons Before Enabling"});
        }
    };

    const handleOnClick = (linkID) => {
        setEditID(linkID);

        setTimeout(function(){
            document.querySelector('#scrollTo').scrollIntoView({
                behavior: 'smooth',
                block: "start",
                inline: "nearest"
            });

        }, 300)

    }

    const fetchFolderLinks = async (linkID) => {

        if(subStatus) {
            const url = 'folder/links/' + linkID;
            const response = await fetch(url);
            const folderLinks = await response.json();

            setOriginalFolderLinks(folderLinks["links"]);
            setFolderLinks(folderLinks["links"]);
            setEditFolderID(linkID);

            setTimeout(function(){
                document.querySelector('#scrollTo').scrollIntoView({
                    behavior: 'smooth',
                    block: "start",
                    inline: "nearest"
                });

            }, 300)

        } else {
            const popup = document.querySelector('#upgrade_popup');
            setShowUpgradePopup(true);
            popup.classList.add('open');
            setOptionText("access your folders");

            setTimeout(() => {
                document.querySelector('#upgrade_popup .close_popup').addEventListener('click', function(e) {
                    e.preventDefault();
                    setShowUpgradePopup(false);
                    popup.classList.remove('open');
                });
            }, 300);
        }

    }

    const {lastPress, isPressed, mouseXY } = state;

    return (
        <>
            {userLinks && userLinks.map((link, key) => {
                let style;
                let x;
                let y;

                const visualPosition = userLinks.findIndex((link) => link.position === key);
                if (key === lastPress && isPressed) {
                    [x, y] = mouseXY;
                    style = {
                        translateX: x,
                        translateY: y,
                        scale: spring(1.2, springSetting1),
                        //boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1)
                    };
                } else {
                    [x, y] = layout[visualPosition];
                    style = {
                        translateX: spring(x, springSetting2),
                        translateY: spring(y, springSetting2),
                        scale: spring(.85, springSetting1),
                        //boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1)
                    };
                }

                const type = originalArray[key].type || null;
                const linkID = originalArray[key].id;
                let hasLinks = true;
                let displayIcon;
                if (type === "folder") {
                    //displayIcon = null;
                    hasLinks = originalArray[key].links.length > 0;
                } else {
                    displayIcon = checkIcon(originalArray[key].icon);
                }

                return (
                    <Motion key={key} style={style}>
                        {({ translateX, translateY, scale }) => (
                            <div
                                ref={targetRef}
                                className="icon_col"
                                style={{
                                    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                                    zIndex: key === lastPress ? 2 : 1,
                                    //boxShadow: `${boxShadow}px 5px 5px rgba(0,0,0,0.5)`,
                                    userSelect: "none",
                                    touchAction: "none",
                                }}
                            >
                                <span className="drag_handle"
                                    onMouseDown={handleMouseDown.bind(null,
                                        key, [x, y])}
                                    onTouchStart={handleTouchStart.bind(
                                        null, key, [x, y])}
                                >
                                    <MdDragHandle/>
                                    <div className="hover_text"><p>Move</p></div>
                                </span>

                                <div className="column_content">
                                    {type === "folder" ?
                                        <div className="icon_wrap folder">
                                            <div className="inner_icon_wrap" onClick={(e) => {fetchFolderLinks(linkID)} }>
                                                <img src={ Vapor.asset('images/blank-folder-square.jpg')} alt=""/>
                                                <div className={hasLinks ? "folder_icons main" : "folder_icons empty"}>
                                                    {hasLinks &&

                                                        originalArray[key].links.slice(
                                                            0, 9).
                                                            map((innerLink, index) => {

                                                                const {id, icon} = innerLink;

                                                                return (
                                                                    <div className="image_col" key={index}>
                                                                        <img src={checkIcon(icon)} alt=""/>
                                                                    </div>
                                                                )
                                                            })
                                                    }
                                                    {!hasLinks && <p><span>+</span> <br />Add<br />Icons</p>}
                                                </div>

                                            </div>
                                        </div>
                                        :
                                        <div className="icon_wrap" onClick={(e) => {
                                            handleOnClick(linkID)
                                        }}>
                                            <div className="image_wrap">
                                                <img src={displayIcon} alt=""/>
                                            </div>
                                        </div>
                                    }
                                    <div className="my_row">
                                        <div className="switch_wrap">
                                            <Switch
                                                onChange={(e) => handleChange(originalArray[key], hasLinks, type)}
                                                height={20}
                                                checked={Boolean(originalArray[key].active_status)}
                                                onColor="#424fcf"
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                            />
                                            <div className="hover_text switch"><p>{Boolean(originalArray[key].active_status) ? "Disable" : "Enable"} {type ? "Folder" : "Icon"}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Motion>
                )
            })}
        </>
    );
};

export default Links;
