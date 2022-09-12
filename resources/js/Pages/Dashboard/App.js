import React, {
    useState,
    useReducer,
    createContext,
    createRef,
    useEffect,
    useRef, useContext,
} from 'react';
import Preview from './Components/Preview/Preview';
import Links from './Components/Link/Links';
import myLinksArray from './Components/Link/LinkItems';
import PageHeader from './Components/Page/PageHeader';
import PageProfile from './Components/Page/PageProfile';
import PageName from './Components/Page/PageName';
import PageNav from './Components/Page/PageNav';
import PageTitle from './Components/Page/PageTitle';
import PageBio from './Components/Page/PageBio';
import AddLink from './Components/Link/AddLink';
import PasswordProtect from './Components/Page/PasswordProtect';
import ShowPreviewButton from './Components/Preview/ShowPreviewButton';
import { Flash } from '../Flash';
import EditForm from './Components/Link/Forms/EditForm';
import { UpgradePopup } from './Components/Popups/UpgradePopup';
import { ConfirmPopup } from './Components/Popups/ConfirmPopup';
import { Loader } from './Loader';
import NewForm from './Components/Link/Forms/NewForm';
import AddFolder from './Components/Folder/AddFolder';
import FolderLinks from './Components/Folder/FolderLinks';
import { ConfirmFolderDelete } from './Components/Popups/ConfirmFolderDelete';
import {ErrorBoundary} from 'react-error-boundary';
import {toolTipPosition} from '../../Services/pageRequests';
import {checkSubStatus} from '../../Services/userService';
import DowngradeAlert from './Components/Popups/DowngradeAlert';
//import myErrorHandler from '../../Services/errorHandler';

import {
    reducer,
    folderLinksReducer,
    origFolderLinksReducer,
    origLinksReducer, LINKS_ACTIONS, ORIGINAL_LINKS_ACTIONS,
} from '../../Services/reducer';
import PageHeaderLayout from './Components/Page/PageHeaderLayout';
import LivePageButton from './Components/LivePageButton';
import EventBus from '../../Utils/Bus';
import FolderHeading from './Components/Folder/FolderHeading';
import {getAllLinks, updateLinksPositions} from '../../Services/linksRequest';

const page = user.page;
const userPages = user.user_pages;
const userSub = user.userSub;
const customIcons = user.userIcons;

export const UserLinksContext = createContext();
export const OriginalArrayContext = createContext();
export const FolderLinksContext = createContext();
export const OriginalFolderLinksContext = createContext()
export const PageContext = createContext();

function App() {

    /* Separating user links array into 2, in order for drag and drop to work properly.
    only 1 state should be updated on drag and drop but both need to be updated for any type of CRUD action  */

    const [userLinks, dispatch] = useReducer(reducer, myLinksArray);
    const [originalArray, dispatchOrig] = useReducer(origLinksReducer, myLinksArray);
    const [folderLinks, dispatchFolderLinks] = useReducer(folderLinksReducer, []);
    const [originalFolderLinks, dispatchOrigFolderLinks] = useReducer(origFolderLinksReducer, [])

    const [pageSettings, setPageSettings] = useState(page);

    const [allUserPages, setAllUserPages] = useState(userPages);
    const [editID, setEditID] = useState(null);
    const [editFolderID, setEditFolderID] = useState(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [showUpgradePopup, setShowUpgradePopup] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showConfirmFolderDelete, setShowConfirmFolderDelete] = useState(false);
    const [optionText, setOptionText] = useState("");
    const [customIconArray, setCustomIconArray] = useState(customIcons);

    const headerRef = createRef(null);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [fileName, setFileName] = useState(null);

    const profileRef = useRef(null)
    const [completedProfileCrop, setCompletedProfileCrop] = useState(null);
    const [profileFileName, setProfileFileName] = useState(null);

    const pageHeaderRef = createRef(null);
    const iconsWrapRef = useRef(null);

    const [subStatus] = useState(checkSubStatus());

    const [showLoader, setShowLoader] = useState(false);
    const [flash, setFlash] = useState({
        show: false,
        type: '',
        msg: ''
    });

    const [row, setRow] = useState(null);
    const [value, setValue] = useState(null);

    const [infoIndex, setInfoIndex] = useState(null);

    useEffect(() => {
        toolTipPosition();
    }, [])

    useEffect(() => {
        window.addEventListener('resize', toolTipPosition);

        return () => {
            window.removeEventListener('resize', toolTipPosition);
        }
    }, []);

    useEffect(() => {
        EventBus.on('success', (data) => {
            showFlash(true, 'success', data.message.replace(/"/g, ""))

            return () => EventBus.remove("success");
        });

    }, []);

    useEffect(() => {
        EventBus.on('error', (data) => {
            showFlash(true, 'error', data.message.replace(/"/g, ""))

            return () => EventBus.remove("error");
        });

    }, []);

    const showFlash = (show = false, type='', msg='') => {
        setFlash({show, type, msg})
    }

    const myErrorHandler = (Error, {componentStack: string}) => {

        const {userLinks, dispatch} = useContext(UserLinksContext);
        const { dispatchOrig } = useContext(OriginalArrayContext);

        if (String(Error).includes("Invalid attempt to destructure non-iterable instance")) {
            const packets = {
                userLinks: userLinks,
            }
            updateLinksPositions(packets)
            .then(() => {

                getAllLinks(pageSettings["id"])
                .then((data) => {
                    if (data["success"]) {
                        dispatch({ type: LINKS_ACTIONS.SET_LINKS, payload: { links: data["userLinks"]} })
                        dispatchOrig({ type: ORIGINAL_LINKS_ACTIONS.SET_ORIGINAL_LINKS, payload: {links: data["userLinks"]} })
                    }
                })
            });
        }
    }

    function ErrorFallback({error, resetErrorBoundary}) {
        return (
            <div role="alert" className="my_row text-center">
                <p>Something went wrong:</p>
                {/*<pre>{error.message}</pre>*/}
                <button className="button red" onClick={(e) => {window.location.reload()}}>Refresh Page</button>
            </div>
        )
    }

    return (
        <div className="my_row page_wrap">

            <UserLinksContext.Provider value={{userLinks, dispatch}} >
                <OriginalArrayContext.Provider value={{ originalArray, dispatchOrig}} >

                    {showLoader &&
                        <Loader />
                    }

                    {flash.show &&
                        <Flash
                            {...flash}
                            setFlash={setFlash}
                            removeFlash={showFlash}
                            pageSettings={pageSettings}
                        />
                    }

                    {showUpgradePopup &&
                        <UpgradePopup
                            optionText={optionText}
                            showUpgradePopup={showUpgradePopup}
                            setShowUpgradePopup={setShowUpgradePopup}
                        />
                    }

                    <FolderLinksContext.Provider value={{ folderLinks, dispatchFolderLinks}} >
                        <OriginalFolderLinksContext.Provider value={{ originalFolderLinks, dispatchOrigFolderLinks}} >

                            {showConfirmPopup &&
                                <ConfirmPopup
                                    editID={editID}
                                    setEditID={setEditID}
                                    showConfirmPopup={showConfirmPopup}
                                    setShowConfirmPopup={setShowConfirmPopup}
                                    folderID={editFolderID}
                                />
                            }

                            {showConfirmFolderDelete &&
                                <ConfirmFolderDelete
                                    showConfirmFolderDelete={showConfirmFolderDelete}
                                    setShowConfirmFolderDelete={setShowConfirmFolderDelete}
                                    folderID={editFolderID}
                                    setEditFolderID={setEditFolderID}
                                />
                            }

                            <PageContext.Provider value={{ pageSettings, setPageSettings }}>
                                <div className="left_column">
                                    <PageNav
                                        allUserPages={allUserPages}
                                        setAllUserPages={setAllUserPages}
                                        userSub={userSub}
                                        subStatus={subStatus}
                                        setShowUpgradePopup={setShowUpgradePopup}
                                        setOptionText={setOptionText}
                                    />

                                    <div className="content_wrap my_row" id="left_col_wrap">
                                        <div className="top_section">
                                            <PageName
                                                infoIndex={infoIndex}
                                                setInfoIndex={setInfoIndex}
                                            />

                                            <PasswordProtect
                                                userSub={userSub}
                                                subStatus={subStatus}
                                                setShowUpgradePopup={setShowUpgradePopup}
                                                setOptionText={setOptionText}
                                                infoIndex={infoIndex}
                                                setInfoIndex={setInfoIndex}
                                            />

                                            <PageHeader
                                                setRef={headerRef}
                                                completedCrop={completedCrop}
                                                setCompletedCrop={setCompletedCrop}
                                                fileName={fileName}
                                                setFileName={setFileName}
                                                setShowLoader={setShowLoader}
                                                infoIndex={infoIndex}
                                                setInfoIndex={setInfoIndex}
                                            />

                                            <PageProfile
                                                profileRef={profileRef}
                                                completedProfileCrop={completedProfileCrop}
                                                setCompletedProfileCrop={setCompletedProfileCrop}
                                                profileFileName={profileFileName}
                                                setProfileFileName={setProfileFileName}
                                                setShowLoader={setShowLoader}
                                                infoIndex={infoIndex}
                                                setInfoIndex={setInfoIndex}
                                            />

                                            <PageTitle
                                                infoIndex={infoIndex}
                                                setInfoIndex={setInfoIndex}
                                            />
                                            <PageBio
                                                infoIndex={infoIndex}
                                                setInfoIndex={setInfoIndex}
                                            />

                                            <PageHeaderLayout
                                                pageHeaderRef={pageHeaderRef}
                                                infoIndex={infoIndex}
                                                setInfoIndex={setInfoIndex}
                                            />

                                            <ShowPreviewButton />
                                            { (userSub && !subStatus) &&
                                                <DowngradeAlert/>
                                            }
                                        </div>

                                        <div className="my_row view_live_link link_row">
                                            <LivePageButton pageName={pageSettings['name']}/>
                                        </div>

                                        { (editFolderID && !showNewForm && !editID) &&

                                            <FolderHeading
                                                subStatus={subStatus}
                                                setShowUpgradePopup={setShowUpgradePopup}
                                                setOptionText={setOptionText}
                                                setEditFolderID={setEditFolderID}
                                                setShowNewForm={setShowNewForm}
                                                setShowConfirmFolderDelete={setShowConfirmFolderDelete}
                                                editFolderID={editFolderID}
                                            />
                                        }


                                        { editID ?
                                                <EditForm
                                                    folderID={editFolderID}
                                                    setEditFolderID={setEditFolderID}
                                                    editID={editID}
                                                    setEditID={setEditID}
                                                    setShowUpgradePopup={setShowUpgradePopup}
                                                    setShowConfirmPopup={setShowConfirmPopup}
                                                    setOptionText={setOptionText}
                                                    customIconArray={customIconArray}
                                                    setCustomIconArray={setCustomIconArray}
                                                    setShowLoader={setShowLoader}
                                                    subStatus={subStatus}
                                                />

                                                :
                                                showNewForm &&
                                                <NewForm
                                                    setShowNewForm={setShowNewForm}
                                                    setShowUpgradePopup={setShowUpgradePopup}
                                                    setOptionText={setOptionText}
                                                    customIconArray={customIconArray}
                                                    setCustomIconArray={setCustomIconArray}
                                                    setShowLoader={setShowLoader}
                                                    folderID={editFolderID}
                                                    setEditFolderID={setEditFolderID}
                                                    subStatus={subStatus}
                                                />
                                        }

                                         { (!editID && !showNewForm && !editFolderID) &&
                                            <>
                                                <div className="my_row link_row">
                                                    <div className="add_more_icons">
                                                        <AddLink
                                                            setShowNewForm={setShowNewForm}
                                                            subStatus={subStatus}
                                                            setShowUpgradePopup={setShowUpgradePopup}
                                                            setOptionText={setOptionText}
                                                        />
                                                    </div>

                                                    {!editFolderID &&
                                                        <div className="add_more_icons">
                                                            <AddFolder
                                                                subStatus={subStatus}
                                                                setShowUpgradePopup={setShowUpgradePopup}
                                                                setOptionText={setOptionText}
                                                                setEditFolderID={setEditFolderID}
                                                            />
                                                        </div>
                                                    }
                                                </div>
                                            </>
                                        }


                                        { (editFolderID && !editID && !showNewForm) ?
                                            <div ref={iconsWrapRef} className='icons_wrap add_icons icons folder'>
                                                <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
                                                    <FolderLinks
                                                        folderID={editFolderID}
                                                        subStatus={subStatus}
                                                        setShowUpgradePopup={setShowUpgradePopup}
                                                        setOptionText={setOptionText}
                                                        setEditFolderID={setEditFolderID}
                                                        setEditID={setEditID}
                                                        setShowNewForm={setShowNewForm}
                                                        setShowConfirmFolderDelete={setShowConfirmFolderDelete}
                                                        iconsWrapRef={iconsWrapRef}
                                                    />
                                                </ErrorBoundary>
                                            </div>

                                            :

                                            (!showNewForm && !editID && !editFolderID) &&
                                            <div ref={iconsWrapRef} className='icons_wrap add_icons icons'>
                                                <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
                                                    <Links
                                                        setEditID={setEditID}
                                                        setEditFolderID={setEditFolderID}
                                                        subStatus={subStatus}
                                                        setRow={setRow}
                                                        setValue={setValue}
                                                        setShowUpgradePopup={setShowUpgradePopup}
                                                        setOptionText={setOptionText}
                                                        iconsWrapRef={iconsWrapRef}
                                                    />
                                                </ErrorBoundary>
                                            </div>
                                        }

                                    </div>
                                </div>
                                <div className="right_column links_col preview">
                                    <Preview
                                        setRef={headerRef}
                                        profileRef={profileRef}
                                        completedCrop={completedCrop}
                                        completedProfileCrop={completedProfileCrop}
                                        fileName={fileName}
                                        profileFileName={profileFileName}
                                        row={row}
                                        setRow={setRow}
                                        value={value}
                                        setValue={setValue}
                                        subStatus={subStatus}
                                        pageHeaderRef={pageHeaderRef}
                                        infoIndex={infoIndex}
                                        setInfoIndex={setInfoIndex}
                                    />
                                </div>
                            </PageContext.Provider>
                        </OriginalFolderLinksContext.Provider>
                    </FolderLinksContext.Provider>
                </OriginalArrayContext.Provider>
            </UserLinksContext.Provider>
        </div>
    );
}

export default App;
