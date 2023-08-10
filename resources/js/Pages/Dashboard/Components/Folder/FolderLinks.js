import React, {
    useRef,
    useLayoutEffect,
    useState,
    useContext,
} from 'react';
import {MdDragHandle} from 'react-icons/md';
import Switch from '@mui/material/Switch'
import {
    UserLinksContext,
    FolderLinksContext,
} from '../../App';
import {
    updateLinksPositions,
    updateLinkStatus,
} from '../../../../Services/LinksRequest';
import {checkIcon} from '../../../../Services/UserService';
import {
    LINKS_ACTIONS,
    FOLDER_LINKS_ACTIONS,
} from '../../../../Services/Reducer';
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
} from 'react-grid-dnd';

const FolderLinks = ({
                         folderID,
                         setEditID,
                         setAccordionValue

               }) => {

    const { dispatch  } = useContext(UserLinksContext);
    //const { dispatchOrig } = useContext(OriginalArrayContext);

    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    //const { originalFolderLinks, dispatchOrigFolderLinks } = useContext(OriginalFolderLinksContext);

    const targetRef = useRef(null);

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
                //dispatchOrigFolderLinks({ type: ORIG_FOLDER_LINKS_ACTIONS.UPDATE_ORIG_FOLDER_LINKS_STATUS, payload: {id: currentItem.id}})
                dispatch ({ type: LINKS_ACTIONS.UPDATE_LINKS_STATUS_FROM_FOLDER, payload: {id: currentItem.id, folderID: folderID } })
                //dispatchOrig ({ type: ORIGINAL_LINKS_ACTIONS.UPDATE_ORIGINAL_LINKS_STATUS_FROM_FOLDER, payload: {id: currentItem.id, folderID: folderID } })

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
