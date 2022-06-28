import React, {useState, useReducer, createContext, createRef, useEffect} from 'react';
import Preview from './components/Preview/Preview';
import Links from './components/Link/Links';
import myLinksArray from './components/Link/LinkItems';
import PageHeader from './components/Page/PageHeader';
import PageProfile from './components/Page/PageProfile';
import PageName from './components/Page/PageName';
import PageNav from './components/Page/PageNav';
import PageTitle from './components/Page/PageTitle';
import PageBio from './components/Page/PageBio';
import AddLink from './components/Link/AddLink';
import PasswordProtect from './components/Page/PasswordProtect';
import ShowPreviewButton from './components/Preview/ShowPreviewButton';
import { Flash } from '../Flash';
import EditForm from './components/Link/EditForm';
import { UpgradePopup } from './components/Popups/UpgradePopup';
import { ConfirmPopup } from './components/Popups/ConfirmPopup';
import { Loader } from './Loader';
import NewForm from './components/Link/NewForm';
import AddFolder from './components/Folder/AddFolder';
import FolderLinks from './components/Folder/FolderLinks';
import { ConfirmFolderDelete } from './components/Popups/ConfirmFolderDelete';
import {ErrorBoundary} from 'react-error-boundary';
import {updateLinksPositions, getAllLinks} from '../../Services/LinksRequest';
import {toolTipPosition, toolTipClick} from '../../Services/PageRequests';
import {checkSubStatus} from '../../Services/UserService';
import DowngradeAlert from './components/Popups/DowngradeAlert';
import {
    folderLinksReducer,
    origFolderLinksReducer,
    origLinksReducer,
    reducer,
} from '../../Services/Reducer';

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

    const ref = createRef(null);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [fileName, setFileName] = useState(null);

    const profileRef = createRef(null)
    const [completedProfileCrop, setCompletedProfileCrop] = useState(null);
    const [profileFileName, setProfileFileName] = useState(null);

    const [subStatus, setSubStatus] = useState(checkSubStatus());

    const [showLoader, setShowLoader] = useState(false);

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
                        setUserLinks(data["userLinks"]);
                        setOriginalArray(data["userLinks"]);
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

    const host = window.location.origin;

    return (
        <div className="my_row page_wrap">

            <UserLinksContext.Provider value={{userLinks, dispatch }} >
                <OriginalArrayContext.Provider value={{ originalArray, dispatchOrig}} >
                    <Loader showLoader={showLoader} />
                    <Flash />

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
                                                setRef={ref}
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

                                            <ShowPreviewButton />

                                            <DowngradeAlert
                                                userSub={userSub}
                                                subStatus={subStatus}
                                            />
                                        </div>

                                        <div className="my_row view_live_link link_row">
                                            <a className="button green w-100" target="_blank" href={host +
                                            '/' +
                                            pageSettings['name']}>Open Live Page</a>
                                        </div>

                                        {editID ?
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
                                            showNewForm ?
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
                                                :
                                                editFolderID ?
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
                                                        />
                                                    </ErrorBoundary>

                                                    :
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
                                                        <div className="add_more_icons">
                                                            <AddFolder
                                                                subStatus={subStatus}
                                                                setShowUpgradePopup={setShowUpgradePopup}
                                                                setOptionText={setOptionText}
                                                                setEditFolderID={setEditFolderID}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="icons_wrap add_icons icons">
                                                        <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
                                                            <Links
                                                                setEditID={setEditID}
                                                                setEditFolderID={setEditFolderID}
                                                                subStatus={subStatus}
                                                                setRow={setRow}
                                                                setValue={setValue}
                                                                setShowUpgradePopup={setShowUpgradePopup}
                                                                setOptionText={setOptionText}
                                                            />
                                                        </ErrorBoundary>

                                                    </div>
                                                </>

                                        }


                                    </div>
                                </div>
                                <div className="right_column links_col preview">
                                    <Preview
                                        setRef={ref}
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
