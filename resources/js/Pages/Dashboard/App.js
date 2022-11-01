import React, {
    useState,
    useReducer,
    createContext,
    createRef,
    useEffect,
    useRef,
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
import PreviewButton from './Components/Preview/PreviewButton';
import { Flash } from '../../Utils/Flash';
import EditForm from './Components/Link/Forms/EditForm';
import { UpgradePopup } from './Components/Popups/UpgradePopup';
import { ConfirmPopup } from './Components/Popups/ConfirmPopup';
import { Loader } from '../../Utils/Loader';
import NewForm from './Components/Link/Forms/NewForm';
import AddFolder from './Components/Folder/AddFolder';
import FolderLinks from './Components/Folder/FolderLinks';
import { ConfirmFolderDelete } from './Components/Popups/ConfirmFolderDelete';
import {ErrorBoundary} from 'react-error-boundary';
import {updateLinksPositions, getAllLinks} from '../../Services/LinksRequest';
import {
    previewButtonRequest,
} from '../../Services/PageRequests';
import {checkSubStatus} from '../../Services/UserService';
import DowngradeAlert from './Components/Popups/DowngradeAlert';
import {
    folderLinksReducer,
    origFolderLinksReducer,
    origLinksReducer,
    reducer,
    LINKS_ACTIONS,
    ORIGINAL_LINKS_ACTIONS,
} from '../../Services/Reducer';
import PageHeaderLayout from './Components/Page/PageHeaderLayout';
import LivePageButton from './Components/LivePageButton';
import EventBus from '../../Utils/Bus';
import FolderHeading from './Components/Folder/FolderHeading';
import InfoText from './Components/Page/InfoText';
import {MessageAlertPopup} from './Components/Popups/MessageAlertPopup';

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
    const [infoText, setInfoText] = useState({section:'', text:[]});
    const [infoTextOpen, setInfoTextOpen] = useState(false)
    const [infoLocation, setInfoLocation] = useState({})
    const [infoClicked, setInfoClicked] = useState(null);

    const [allUserPages, setAllUserPages] = useState(userPages);
    const [editFolderID, setEditFolderID] = useState(null);

    const [showNewForm, setShowNewForm] = useState(false)
    const [editID, setEditID] = useState(null);
    const [radioValue, setRadioValue] = useState("standard");
    const [inputType, setInputType] = useState(null);
    const [integrationType, setIntegrationType] = useState(null);

    const [showUpgradePopup, setShowUpgradePopup] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showMessageAlertPopup, setShowMessageAlertPopup] = useState(false);
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
    const leftColWrap = useRef(null);

    const [subStatus] = useState(checkSubStatus());

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: ""
    });
    const [flash, setFlash] = useState({
        show: false,
        type: '',
        msg: ''
    });

    const [row, setRow] = useState(null);
    const [value, setValue] = useState(null);

    const [infoIndex, setInfoIndex] = useState(null);

    const [showPreviewButton, setShowPreviewButton] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [connectionError, setConnectionError] = useState(false);

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

    function setPreviewButton() {
        previewButtonRequest(setShowPreviewButton);
    }

    useEffect(() => {
        setPreviewButton();
    }, [])

    useEffect(() => {

        window.addEventListener('resize', setPreviewButton);

        return () => {
            window.removeEventListener('resize', setPreviewButton);
        }

    }, [])

    const [redirected, setRedirected] = useState(false);

    useEffect(() => {
        const href = window.location.href.split('?')[0]
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const redirected = urlParams?.get('redirected');
        const error = urlParams?.get('connection_error');

        if (redirected === "mailchimp" || redirected === "shopify") {
            setShowNewForm(JSON.parse(localStorage.getItem('showNewForm')) || false)
            setEditID(JSON.parse(localStorage.getItem('editID')) || null)
            setInputType(localStorage.getItem('inputType') || null)
            setRadioValue("integration");
            setRedirected(true);
            setIntegrationType(redirected);

            setTimeout(function(){
                document.querySelector('#scrollTo').scrollIntoView({
                    behavior: 'smooth',
                    block: "start",
                    inline: "nearest"
                });

                urlParams.delete('redirected')
                window.history.pushState({}, document.title, href);
                localStorage.clear();

            }, 800)

            if (error) {
                setConnectionError(error)
            }
        }

    }, [])

    const myErrorHandler = (Error, {componentStack: string}) => {

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

    function errorFallback ({error, resetErrorBoundary}) {
        return (
            <div role="alert" className="my_row text-center">
                <p>Something went wrong:</p>
                {/*<pre>{error.message}</pre>*/}
                <button className="button red" onClick={(e) => {window.location.reload()}}>Refresh Page</button>
            </div>
        )
    }

    const showFlash = (show = false, type='', msg='') => {
        setFlash({show, type, msg})
    }

    return (
        <div className="my_row page_wrap">

            <UserLinksContext.Provider value={{userLinks, dispatch }} >
                <OriginalArrayContext.Provider value={{ originalArray, dispatchOrig}} >

                    { (showLoader.show && showLoader.position === "fixed") &&
                        <Loader
                            showLoader={showLoader}
                        />
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

                    {showMessageAlertPopup &&
                        <MessageAlertPopup
                            optionText={optionText}
                            showMessageAlertPopup={showMessageAlertPopup}
                            setShowMessageAlertPopup={setShowMessageAlertPopup}
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
                                    iconsWrapRef={iconsWrapRef}
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

                            <PageContext.Provider value={{
                                pageSettings,
                                setPageSettings,
                                infoText,
                                setInfoText,
                                infoTextOpen,
                                setInfoTextOpen,
                                infoLocation,
                                setInfoLocation,
                                infoClicked,
                                setInfoClicked
                            }}>
                                <div className="left_column">
                                    <PageNav
                                        allUserPages={allUserPages}
                                        setAllUserPages={setAllUserPages}
                                        userSub={userSub}
                                        subStatus={subStatus}
                                        setShowUpgradePopup={setShowUpgradePopup}
                                        setOptionText={setOptionText}
                                    />

                                    <div ref={leftColWrap} className="content_wrap my_row" id="left_col_wrap">
                                        <div className="top_section">
                                            <PageName />

                                            <PasswordProtect
                                                userSub={userSub}
                                                subStatus={subStatus}
                                                setShowUpgradePopup={setShowUpgradePopup}
                                                setOptionText={setOptionText}
                                            />

                                            <PageHeader
                                                setRef={headerRef}
                                                completedCrop={completedCrop}
                                                setCompletedCrop={setCompletedCrop}
                                                fileName={fileName}
                                                setFileName={setFileName}
                                                setShowLoader={setShowLoader}
                                            />

                                            <PageProfile
                                                profileRef={profileRef}
                                                completedProfileCrop={completedProfileCrop}
                                                setCompletedProfileCrop={setCompletedProfileCrop}
                                                profileFileName={profileFileName}
                                                setProfileFileName={setProfileFileName}
                                                setShowLoader={setShowLoader}
                                            />

                                            <PageTitle />
                                            <PageBio />

                                            <PageHeaderLayout
                                                pageHeaderRef={pageHeaderRef} />

                                            <InfoText
                                                leftColWrap={leftColWrap}
                                            />

                                            {showPreviewButton &&
                                                <PreviewButton setShowPreview={setShowPreview}/>
                                            }

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
                                                setRadioValue={setRadioValue}
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
                                                    radioValue={radioValue}
                                                    setRadioValue={setRadioValue}
                                                    redirected={redirected}
                                                    setRedirected={setRedirected}
                                                    setShowMessageAlertPopup={setShowMessageAlertPopup}
                                                    connectionError={connectionError}
                                                />

                                                :
                                                showNewForm &&
                                                <NewForm
                                                    setShowNewForm={setShowNewForm}
                                                    setShowUpgradePopup={setShowUpgradePopup}
                                                    setOptionText={setOptionText}
                                                    customIconArray={customIconArray}
                                                    setCustomIconArray={setCustomIconArray}
                                                    showLoader={showLoader}
                                                    setShowLoader={setShowLoader}
                                                    folderID={editFolderID}
                                                    setEditFolderID={setEditFolderID}
                                                    subStatus={subStatus}
                                                    radioValue={radioValue}
                                                    setRadioValue={setRadioValue}
                                                    inputType={inputType}
                                                    setInputType={setInputType}
                                                    setShowMessageAlertPopup={setShowMessageAlertPopup}
                                                    connectionError={connectionError}
                                                    integrationType={integrationType}
                                                    setIntegrationType={setIntegrationType}
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
                                                            setRadioValue={setRadioValue}
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
                                                <ErrorBoundary FallbackComponent={errorFallback} onError={myErrorHandler}>
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
                                                <ErrorBoundary FallbackComponent={errorFallback} onError={myErrorHandler}>
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
                                <div className={`right_column links_col preview ${showPreview && "show"}`}>
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
                                        setShowPreview={setShowPreview}
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
