import React, {
    useCallback,
    useRef,
    useEffect,
    useLayoutEffect,
    useState,
    useContext,
} from 'react';
import {MdDeleteForever, MdDragHandle, MdChevronLeft} from 'react-icons/md';
import Switch from "react-switch";
import {UserLinksContext, OriginalArrayContext} from '../App';
import {Motion, spring} from 'react-motion';
import {
    updateLinksPositions,
    updateLinkStatus,
    getColHeight,
    getColWidth,
} from '../../../../Services/LinksRequest';
import {updateFolderName} from '../../../../Services/FolderRequests';
import AddLink from '../Link/AddLink';

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

const FolderLinks = ({
                         folderID,
                         userSub,
                         setShowUpgradePopup,
                         setOptionText,
                         setEditFolderID,
                         setEditID,
                         folderLinks,
                         setFolderLinks,
                         originalFolderLinks,
                         setOriginalFolderLinks,
                         setShowNewForm,
                         setShowConfirmFolderDelete

               }) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const { originalArray, setOriginalArray } = useContext(OriginalArrayContext);

    const [ currentFolder, setCurrentFolder ] = useState(
        userLinks.find(function(e) {
            return e.id === folderID && e.type === "folder"
        }) || null );

    const [charactersLeft, setCharactersLeft] = useState();

    useEffect(() => {
        if(currentFolder.name) {
            setCharactersLeft(11 - currentFolder.name.length);
        } else {
            setCharactersLeft(11);
        }
    },[charactersLeft])

    const initialRender = useRef(true);
    const targetRef = useRef();

    const [size, setSize] = useState({
        height: 0,
        width: 0
    });

    useLayoutEffect(() => {

        setTimeout(() => {
            if (targetRef.current && folderLinks.length > 0) {
                setSize({
                    height: getColHeight(),
                    width: getColWidth("folder"),
                })
            }
        }, 300)

    }, [folderLinks])


    const [state, setState] = useState(() => ({
        mouseXY: [0,0],
        mouseCircleDelta: [0,0], // difference between mouse and circle pos for x + y coords, for dragging
        lastPress: null,
        isPressed: false,
    }));

    useEffect(() => {

        function handleResize() {

            setTimeout(() => {
                const iconsWrap = document.querySelector('.icons_wrap');
                const icons = document.querySelectorAll('.add_icons .icon_col');
                if (icons.length > 0 ) {
                    const colHeight = icons[0].clientHeight;
                    const rowCount = Math.ceil(icons.length / 3);
                    let divHeight = rowCount * colHeight - 40;
                    if (folderLinks.length < 4) {
                        divHeight += 20;
                    }
                    iconsWrap.style.minHeight = divHeight + "px";
                } else {
                    iconsWrap.style.minHeight = "200px";
                }
            }, 500)
        }

        window.addEventListener('resize', handleResize);
        handleResize()


        return () => {
            window.removeEventListener('resize', handleResize);
        }
    },[]);

    let [width, height] = [size.width, size.height];

    useEffect(() => {

        function handleResize() {
            setSize({
                height: getColHeight(),
                width: getColWidth("folder"),
            })
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    // indexed by visual position
    const layout = folderLinks.map((link, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
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
                    Math.floor(folderLinks.length / 3)
                );
                let index = row * 3 + col;

                const newOrder = reinsert(
                    folderLinks,
                    folderLinks.findIndex((link) => link.position === lastPress),
                    index,
                );
                setState((state) => ({ ...state, mouseXY }));
                setFolderLinks(newOrder);

                setOriginalArray(originalArray.map((item) => {
                        if (item.id === folderID && item.type === "folder") {

                            return {
                                ...item,
                                links: newOrder
                            }
                        }

                        return item;

                    })
                )

                setUserLinks(userLinks.map((item) => {
                        if (item.id === folderID && item.type === "folder") {

                            return {
                                ...item,
                                links: newOrder
                            }
                        }

                        return item;

                    })
                )
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
        } else if(state.isPressed === false) {
            const packets = {
                userLinks: folderLinks,
            }
            updateLinksPositions(packets);
        }
    }, [state.isPressed]);

    const handleChange = (currentItem) => {
        const newStatus = !currentItem.active_status;

        const packets = {
            active_status: newStatus,
        };

        const url = "/dashboard/links/status/"

        updateLinkStatus(packets, currentItem.id, url)
        .then((data) => {

            if(data.success) {
                setFolderLinks(
                    folderLinks.map((item) => {
                        if (item.id === currentItem.id) {
                            return {
                                ...item,
                                active_status: newStatus,
                            };
                        }
                        return item;
                    })
                )

                setOriginalFolderLinks(
                    originalFolderLinks.map((item) => {
                        if (item.id === currentItem.id) {
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
                        if (item.id === folderID && item.type === "folder") {

                            const newItemLinks = item.links.map((linkItem) => {

                                if (linkItem.id === currentItem.id) {

                                    return {
                                        ...linkItem,
                                        active_status: newStatus,
                                    }
                                }

                                return linkItem;
                            })

                            return {
                                ...item,
                                links: newItemLinks
                            }
                        }
                        return item;
                    })
                )

                setOriginalArray(
                    originalArray.map((item) => {
                        if (item.id === folderID && item.type === "folder") {

                            const newItemLinks = item.links.map((linkItem) => {

                                if (linkItem.id === currentItem.id) {

                                    return {
                                        ...linkItem,
                                        active_status: newStatus,
                                    }
                                }

                                return linkItem
                            })

                            return {
                                ...item,
                                links: newItemLinks
                            }
                        }
                        return item;
                    })
                )
            }
        })
    };

    const handleOnClick = (linkID) => {
        setEditID(linkID);

        setTimeout(function(){
            document.querySelector('#scrollTo').scrollIntoView({
                behavior: 'smooth',
                block: "start",
                inline: "nearest"
            });

        }, 800)

    }

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

    const handleSubmit = () => {

        const packets = {
            folderName: currentFolder.name
        }

        updateFolderName(folderID, packets)
        .then((data) => {

            if(data.success) {

                setUserLinks(
                    userLinks.map((item) => {
                        if (item.id === folderID && item.type === "folder") {
                            item.name = currentFolder.name;

                            return item
                        }

                        return item
                    })
                )
                setOriginalArray(
                    originalArray.map((item) => {
                        if (item.id === folderID && item.type === "folder") {
                            item.name = currentFolder.name;

                            return item
                        }

                        return item
                    })
                )
            }
        })
    }

    const handleFolderName = (e) => {
        let value = e.target.value;

        setCharactersLeft(11 - value.length);

        setCurrentFolder({
            ...currentFolder,
            name: value
        })
    }

    const handleDeleteFolder = e => {

        e.preventDefault();
        setShowConfirmFolderDelete(true);
        document.querySelector('#confirm_folder_popup_link').classList.add('open');
    }

    const { lastPress, isPressed, mouseXY } = state;

    return (

        <>
            <div className="my_row icon_breadcrumb" id="scrollTo">
                <p>Editing Folder</p>
                <div className="breadcrumb_links">
                    <a className="back" href="#"
                       onClick={(e) => { e.preventDefault(); setEditFolderID(null); }}
                    >
                        <MdChevronLeft />
                        Back To Icons
                    </a>
                    <div className="delete_icon">
                        <a className="delete" href="#" onClick={handleDeleteFolder}><MdDeleteForever /></a>
                        <div className="hover_text delete_folder"><p>Delete Folder</p></div>
                    </div>
                </div>
            </div>
            <div className="folder_name my_row">
                <div className="input_wrap">
                    <input
                        /*maxLength="13"*/
                        name="name"
                        type="text"
                        value={currentFolder.name || ""}
                        placeholder="Folder Name"
                        onChange={(e) => handleFolderName(e)}
                        onKeyPress={ event => {
                            if(event.key === 'Enter') {
                                handleSubmit(event);
                            }
                        }
                        }
                        onBlur={(e) => handleSubmit(e)}
                    />
                </div>
                <div className="my_row info_text">
                    <p className="char_max">Max 11 Characters Shown</p>
                    <p className="char_count">
                        {charactersLeft < 0 ?
                            <span className="over">Only 11 Characters Will Be Shown</span>
                            :
                            "Characters Left: " + charactersLeft
                        }
                    </p>
                </div>
            </div>
            <div className="my_row link_row folders">

                <div className="add_more_icons">
                    <AddLink
                        setShowNewForm={setShowNewForm}
                        userSub={userSub}
                        setShowUpgradePopup={setShowUpgradePopup}
                        setOptionText={setOptionText}
                    />
                </div>
            </div>

            <div className="icons_wrap add_icons icons folder">

                {folderLinks.length > 0 && folderLinks.map((link, key) => {
                    let style;
                    let x;
                    let y;

                    const visualPosition = folderLinks.findIndex((link) => link.position === key);
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

                    const linkID = originalFolderLinks[key].id;
                    let displayIcon;
                    displayIcon = checkSubStatus(originalFolderLinks[key].icon);

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
                                        <div className="hover_text"><p>Move Icon</p></div>
                                    </span>

                                    <div className="column_content">

                                        <div className="icon_wrap" onClick={(e) => {
                                            handleOnClick(linkID)
                                        }}>
                                            <div className="image_wrap">
                                                <img src={displayIcon ||
                                                Vapor.asset(
                                                    'images/icon-placeholder.png')} alt=""/>
                                                {/*<div className="hover_text"><p><img src='/images/icon-placeholder.png' alt=""/></p></div>*/}
                                            </div>
                                        </div>

                                        <div className="my_row">
                                            <div className="switch_wrap">
                                                <Switch
                                                    onChange={(e) => handleChange(originalFolderLinks[key])}
                                                    height={20}
                                                    checked={Boolean(originalFolderLinks[key].active_status)}
                                                    onColor="#424fcf"
                                                    uncheckedIcon={false}
                                                    checkedIcon={false}
                                                />
                                                <div className="hover_text switch"><p>{Boolean(originalFolderLinks[key].active_status) ? "Deactivate" : "Active"} Icon</p></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Motion>
                    )
                })}
            </div>
        </>
    );
};

export default FolderLinks;
