import React, {useState, useReducer, createContext, createRef, useEffect} from 'react';
import Preview from './Preview/Preview';
import Links from './Link/Links';
import myLinksArray from './Link/LinkItems';
import PageHeader from './Page/PageHeader';
import PageProfile from './Page/PageProfile';
import PageName from './Page/PageName';
import PageNav from './Page/PageNav';
import PageTitle from './Page/PageTitle';
import PageBio from './Page/PageBio';
import AddLink from './Link/AddLink';
import PasswordProtect from './Page/PasswordProtect';
import ShowPreviewButton from './Preview/ShowPreviewButton';
import { Flash } from '../../Flash';
import EditForm from './Link/EditForm';
import { UpgradePopup } from './UpgradePopup';
import { ConfirmPopup } from './ConfirmPopup';
import { Loader } from './Loader';
import NewForm from './Link/NewForm';
import AddFolder from './Folder/AddFolder';
import FolderLinks from './Folder/FolderLinks';
import { ConfirmFolderDelete } from './ConfirmFolderDelete';
import {ErrorBoundary} from 'react-error-boundary';
import {updateLinksPositions, getAllLinks} from '../../../Services/LinksRequest';
import {toolTipPosition, toolTipClick} from '../../../Services/PageRequests';
import {checkSubStatus} from '../../../Services/UserService';
import DowngradeAlert from './DowngradeAlert';
/*import {isMobile} from 'react-device-detect';*/

const page = user.page;
const userPages = user.user_pages;
const userSub = user.userSub;
const customIcons = user.userIcons;

export const UserLinksContext = createContext();
export const OriginalArrayContext = createContext();
export const FolderLinksContext = createContext();
export const OriginalFolderLinksContext = createContext()
export const PageContext = createContext();

function pageReducer(state, item) {
    return item
}

function App() {

    const [userLinks, setUserLinks] = useState(myLinksArray);
    const [originalArray, setOriginalArray] = useState(myLinksArray);
    const [pageSettings, setPageSettings] = useReducer(pageReducer, page);

    const [folderLinks, setFolderLinks] = useState([])
    const [originalFolderLinks, setOriginalFolderLinks] = useState([])

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

            <UserLinksContext.Provider value={{ userLinks, setUserLinks}} >
                <OriginalArrayContext.Provider value={{ originalArray, setOriginalArray}} >
                    <Loader showLoader={showLoader} />
                    <Flash />

                    <div id="upgrade_popup">
                        {showUpgradePopup &&
                            <UpgradePopup
                                optionText={optionText}
                            />
                        }
                    </div>
                    <FolderLinksContext.Provider value={{ folderLinks, setFolderLinks}} >
                        <OriginalFolderLinksContext.Provider value={{ originalFolderLinks, setOriginalFolderLinks}} >

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
