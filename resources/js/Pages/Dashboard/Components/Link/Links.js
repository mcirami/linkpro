import React, {
    useCallback,
    useRef,
    useEffect,
    useState,
    useContext,
    useLayoutEffect,
    createRef,
} from 'react';
import {MdDragHandle} from 'react-icons/md';
import Switch from '@mui/material/Switch'
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
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
} from 'react-grid-dnd';

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
                   setAccordionValue
}) => {

    const { userLinks, dispatch } = useContext(UserLinksContext);
    const { originalArray, dispatchOrig } = useContext(OriginalArrayContext);
    const { dispatchFolderLinks } = useContext(FolderLinksContext);
    const { dispatchOrigFolderLinks } = useContext(OriginalFolderLinksContext);

    const targetRef = useRef(null);

    const [rowHeight, setRowHeight] = useState(240);

    function handleResize() {

        const areaWidth = targetRef.current.getBoundingClientRect().width;
        const colWidth = (areaWidth/4 - 30.5);
        let percentage = .48;
        let percentDiff;

        if (window.innerWidth > 767 && areaWidth < 490) {
            percentDiff = 490 - areaWidth;
            percentage = percentage + ((percentDiff / 4) / 100)
        }

        if (window.innerWidth > 767 && areaWidth < 726) {
            percentDiff = 726 - areaWidth;
            percentage = percentage + ((percentDiff / 4) / 100)
        }

        if (window.innerWidth < 769 && areaWidth < 688) {
            percentDiff = 688 - areaWidth;
            percentage = percentage + ((percentDiff / 4) / 100)
        }


        const diff = colWidth * percentage;
        const rowHeight = colWidth + diff + 15;
        setRowHeight(rowHeight);
    }

    useEffect(() => {

        handleResize()
    },[])

    useLayoutEffect(() => {

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    },[]);

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
        const currentLink = userLinks.find(function(e) {
            return e.id === linkID
        });

        if(currentLink.type === "shopify" || currentLink.type === "mailchimp") {
            setAccordionValue("integration")
        } else if(currentLink.icon.includes("offer-images")) {
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

    /*const {lastPress, isPressed, mouseXY } = state;*/

    const handleGridOnChange = (sourceId, sourceIndex, targetIndex) => {
        const nextState = swap(userLinks, sourceIndex, targetIndex);
        dispatch ({ type: LINKS_ACTIONS.SET_LINKS, payload: {links: nextState}})
        const packets = {
            userLinks: nextState,
        }
        updateLinksPositions(packets);
    }

    return (
        <div ref={targetRef} className='icons_wrap add_icons icons'>

            {userLinks.length === 0 &&
                <div className="info_message">
                    <p>You don't have any icons to display.</p>
                    <p>Click 'Add Icon' above to start adding links.</p>
                </div>
            }

            <GridContextProvider onChange={handleGridOnChange}>
                <div className="my_row">
                    <GridDropZone
                        id="items"
                        boxesPerRow={4}
                        rowHeight={rowHeight}
                        style={{ height: rowHeight * Math.ceil(userLinks.length / 4)}}
                    >

                        {userLinks?.map((link, key) => {
                            const type = userLinks[key].type || null;
                            const linkID = userLinks[key].id;
                            let hasLinks = true;
                            let displayIcon;
                            if (type === "folder") {
                                hasLinks = userLinks[key].links.length > 0;
                            } else {
                                displayIcon = checkIcon(userLinks[key].icon);
                            }

                            return (
                                <GridItem key={link.id} className="grid_item" style={{ padding: '10px'}}>
                                    <div className="icon_col">
                                        <span className="drag_handle">
                                            <MdDragHandle/>
                                            <div className="hover_text"><p>Move</p></div>
                                        </span>

                                        <div className="column_content">
                                            {type === "folder" ?
                                                <div className="icon_wrap folder">
                                                    <div className="inner_icon_wrap" onClick={(e) => {
                                                        fetchFolderLinks(linkID)
                                                    }}>
                                                        <img src={Vapor.asset(
                                                            'images/blank-folder-square.jpg')} alt=""/>
                                                        <div className={hasLinks ?
                                                            "folder_icons main" :
                                                            "folder_icons empty"}>
                                                            {hasLinks && userLinks[key].links.slice(
                                                                    0, 9).map((innerLink, index) => {

                                                                        const {
                                                                            id,
                                                                            icon
                                                                        } = innerLink;

                                                                        return (
                                                                            <div className="image_col" key={index}>
                                                                                <img src={checkIcon(
                                                                                    icon)} alt=""/>
                                                                            </div>
                                                                        )
                                                                    })
                                                            }
                                                            {!hasLinks &&
                                                                <p><span>+</span> <br/>Add<br/>Icons
                                                                </p>}
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
                                                        onChange={() => handleChange(userLinks[key], hasLinks, type)}
                                                        checked={Boolean(userLinks[key].active_status)}
                                                    />
                                                    <div className="hover_text switch">
                                                        <p>
                                                            {Boolean(userLinks[key].active_status) ? "Disable" : "Enable"}
                                                            {type === "folder" ? "Folder" : "Icon"}
                                                        </p>
                                                    </div>
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

export default Links;
