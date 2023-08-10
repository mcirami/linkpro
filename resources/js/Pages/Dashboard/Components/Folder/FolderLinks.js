import React, {
    useCallback,
    useRef,
    useEffect,
    useLayoutEffect,
    useState,
    useContext,
} from 'react';
import {MdDragHandle} from 'react-icons/md';
import Switch from '@mui/material/Switch'
import {
    UserLinksContext,
    OriginalArrayContext,
    FolderLinksContext,
    OriginalFolderLinksContext,
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
import folder from '../Preview/Folder';
import {
    LINKS_ACTIONS,
    ORIGINAL_LINKS_ACTIONS,
    FOLDER_LINKS_ACTIONS,
    ORIG_FOLDER_LINKS_ACTIONS
} from '../../../../Services/Reducer';
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
} from 'react-grid-dnd';

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
                         setEditID,
                         iconsWrapRef,
                         setAccordionValue

               }) => {

    const { dispatch  } = useContext(UserLinksContext);
    const { dispatchOrig } = useContext(OriginalArrayContext);

    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    const { originalFolderLinks, dispatchOrigFolderLinks } = useContext(OriginalFolderLinksContext);

    const initialRender = useRef(true);
    const targetRef = useRef(null);

    /*const [size, setSize] = useState({
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
        updateContentHeight(iconsWrapRef, true);
    }, []);

    useEffect(() => {

        function handleResize() {
            updateContentHeight(iconsWrapRef, true);
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

                dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS, payload: {links: newOrder}})
                dispatchOrig({ type: ORIGINAL_LINKS_ACTIONS.SET_FOLDER_LINKS_ORDER, payload: {links: newOrder, id: folderID}})
                dispatch({ type: LINKS_ACTIONS.SET_FOLDER_LINKS_ORDER, payload: {links: newOrder, id: folderID}})
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
    }, [state.isPressed]);*/

    const [rowHeight, setRowHeight] = useState(240);

    function handleResize() {

        const areaWidth = targetRef.current.getBoundingClientRect().width;
        const colWidth = (areaWidth/3 - 20.5);
        let percentDiff = null;
        let percentage = .2124;

        if (window.innerWidth > 767 && areaWidth < 490) {
            percentDiff = 490 - areaWidth;
            percentage = percentage + ((percentDiff / 7) / 100)
        }

        if (window.innerWidth > 767 && areaWidth < 726) {
            percentDiff = 726 - areaWidth;
            percentage = percentage + ((percentDiff / 6.5) / 100)
        }

        if (window.innerWidth < 769 && areaWidth < 688) {
            percentDiff = 688 - areaWidth;
            percentage = percentage + ((percentDiff / 7) / 100)
        }

        const diff = colWidth * percentage;
        const rowHeight = colWidth + diff + 10;
        setRowHeight(rowHeight);
    }

    useLayoutEffect(() => {
        handleResize()
    },[])

    useLayoutEffect(() => {

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    },[]);

    const handleChange = (currentItem) => {
        const newStatus = !currentItem.active_status;

        const packets = {
            active_status: newStatus,
        };

        const url = "/dashboard/links/status/"

        updateLinkStatus(packets, currentItem.id, url)
        .then((data) => {

            if(data.success) {

                dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS_STATUS, payload: {id: currentItem.id } })
                dispatchOrigFolderLinks({ type: ORIG_FOLDER_LINKS_ACTIONS.UPDATE_ORIG_FOLDER_LINKS_STATUS, payload: {id: currentItem.id}})
                dispatch ({ type: LINKS_ACTIONS.UPDATE_LINKS_STATUS_FROM_FOLDER, payload: {id: currentItem.id, folderID: folderID } })
                dispatchOrig ({ type: ORIGINAL_LINKS_ACTIONS.UPDATE_ORIGINAL_LINKS_STATUS_FROM_FOLDER, payload: {id: currentItem.id, folderID: folderID } })

            }
        })
    };

    const handleOnClick = (linkID) => {
        setEditID(linkID);

        const currentLink = folderLinks.find(function(e) {
            return e.id === linkID
        });

        if(currentLink.icon.includes("offer-images")) {
            setAccordionValue("offer")
        } else if (currentLink.icon.includes("custom-icons")){
            setAccordionValue("custom")
        } else {
            setAccordionValue("standard")
        }

        setTimeout(function(){
            document.querySelector('#scrollTo').scrollIntoView({
                behavior: 'smooth',
                block: "start",
                inline: "nearest"
            });

        }, 800)

    }

    const handleGridOnChange = (sourceId, sourceIndex, targetIndex) => {
        const nextState = swap(folderLinks, sourceIndex, targetIndex);
        dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS, payload: {links: nextState}})
        dispatch({ type: LINKS_ACTIONS.SET_FOLDER_LINKS_ORDER, payload: {links: nextState, id: folderID}})

        const packets = {
            userLinks: nextState,
        }
        updateLinksPositions(packets);
    }

    return (

        <div ref={targetRef} className='icons_wrap add_icons icons folder'>

            {folderLinks.length === 0 &&
                <div className="info_message">
                    <p>You don't have any icons to display in this folder.</p>
                    <p>Click 'Add Icon' above to start adding links.</p>
                </div>
            }
            <GridContextProvider onChange={handleGridOnChange}>
                <div className="my_row">
                    <GridDropZone
                        id="items"
                        boxesPerRow={3}
                        rowHeight={rowHeight}
                        style={{ height: rowHeight * Math.ceil(folderLinks.length / 3)}}
                    >
                        {folderLinks.length > 0 && folderLinks.map((link, key) => {

                            const linkID = folderLinks[key].id;
                            let displayIcon;
                            displayIcon = checkIcon(folderLinks[key].icon);

                            return (
                                <GridItem key={link.id} className="grid_item" style={{ padding: '10px'}}>
                                    <div className="icon_col">
                                        <span className="drag_handle">
                                            <MdDragHandle/>
                                            <div className="hover_text"><p>Move</p></div>
                                        </span>

                                        <div className="column_content">

                                            <div className="icon_wrap" onClick={(e) => {
                                                handleOnClick(linkID)
                                            }}>
                                                <div className="image_wrap">
                                                    <img src={displayIcon} alt=""/>
                                                </div>
                                            </div>

                                            <div className="my_row">
                                                <div className="switch_wrap">
                                                    <Switch
                                                        onChange={(e) => handleChange(folderLinks[key])}
                                                        checked={Boolean(folderLinks[key].active_status)}
                                                    />
                                                    <div className="hover_text switch"><p>{Boolean(folderLinks[key].active_status) ? "Deactivate" : "Active"} Icon</p></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </GridItem>
                            )
                        })}
                    </GridDropZone>
                </div>
            </GridContextProvider>

        </div>
    );
};

export default FolderLinks;
