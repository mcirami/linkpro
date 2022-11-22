import React, {
    useCallback,
    useRef,
    useEffect,
    useState,
    useContext,
} from 'react';
import {MdDragHandle} from 'react-icons/md';
import Switch from "react-switch";
import {
    UserLinksContext,
    OriginalArrayContext,
    FolderLinksContext,
    OriginalFolderLinksContext
} from '../../App';
import {Motion, spring} from 'react-motion';
import {
    updateLinksPositions,
    updateLinkStatus,
    getColHeight,
    getColWidth,
    updateContentHeight,
} from '../../../../Services/LinksRequest';
import {checkIcon} from '../../../../Services/UserService';
import EventBus from '../../../../Utils/Bus';

import {
    LINKS_ACTIONS,
    ORIGINAL_LINKS_ACTIONS,
    FOLDER_LINKS_ACTIONS,
    ORIG_FOLDER_LINKS_ACTIONS
} from '../../../../Services/Reducer';

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
                   setOptionText,
                   subStatus,
                   iconsWrapRef,
                   setInputType
               }) => {

    const { userLinks, dispatch } = useContext(UserLinksContext);
    const { originalArray, dispatchOrig } = useContext(OriginalArrayContext);
    const { dispatchFolderLinks } = useContext(FolderLinksContext);
    const { dispatchOrigFolderLinks } = useContext(OriginalFolderLinksContext);

    const initialRender = useRef(true);
    const targetRef = useRef(null);

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

        updateContentHeight(iconsWrapRef);

    }, []);

    useEffect(() => {

        function handleResize() {

            updateContentHeight(iconsWrapRef)
        }

        window.addEventListener('resize', handleResize);

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
                dispatch ({ type: LINKS_ACTIONS.SET_LINKS, payload: {links: newOrder}})
            }
        },
        [state]
    );



    const handleTouchMove = useCallback((e) => {
            e.preventDefault();
            handleMouseMove(e.touches[0]);
        },
        [handleMouseMove]
    );

    const handleMouseUp = useCallback(() => {
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
                setShowUpgradePopup(true);
                setOptionText("enable your folders");

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

                updateLinkStatus(packets, currentItem.id, url)
                .then((data) => {

                    if (data.success) {

                        dispatchOrig( { type: ORIGINAL_LINKS_ACTIONS.UPDATE_ORIGINAL_LINKS_STATUS, payload: {id: currentItem.id}} )
                        dispatch( { type: LINKS_ACTIONS.UPDATE_LINKS_STATUS, payload: {id: currentItem.id}} )

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

            dispatchOrigFolderLinks({ type: ORIG_FOLDER_LINKS_ACTIONS.SET_ORIG_FOLDER_LINKS, payload: {links: folderLinks["links"]} })
            dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS, payload: {links: folderLinks["links"]} })
            setEditFolderID(linkID);

            setTimeout(function(){
                document.querySelector('#scrollTo').scrollIntoView({
                    behavior: 'smooth',
                    block: "start",
                    inline: "nearest"
                });

            }, 300)

        } else {
            setShowUpgradePopup(true);
            setOptionText("access your folders");
        }

    }

    const {lastPress, isPressed, mouseXY } = state;

    return (
        <>
            {userLinks?.map((link, key) => {
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
