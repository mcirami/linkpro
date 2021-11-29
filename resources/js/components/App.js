import React, {useState, useReducer, createContext, createRef, useCallback, useEffect} from 'react';
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
import { Flash } from './Flash';
import SubmitForm from './Link/SubmitForm';
import { UpgradePopup } from './UpgradePopup';
import { ConfirmPopup } from './ConfirmPopup';

const page = user.page;
const userPages = user.user_pages;
const userSub = user.userSub;
const customIcons = user.userIcons;

export const UserLinksContext = createContext();
export const OriginalArrayContext = createContext();
export const PageContext = createContext();

function pageReducer(state, item) {
    return item
}

function App() {

    const [userLinks, setUserLinks] = useState(myLinksArray);
    const [originalArray, setOriginalArray] = useState(myLinksArray);
    const [pageSettings, setPageSettings] = useReducer(pageReducer, page);

    const [allUserPages, setAllUserPages] = useState(userPages);
    const [editID, setEditID] = useState(null);
    const [showUpgradePopup, setShowUpgradePopup] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [optionText, setOptionText] = useState("");
    const [customIconArray, setCustomIconArray] = useState(customIcons);

    const ref = createRef(null);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [fileName, setFileName] = useState(null);

    const profileRef = createRef(null)
    const [completedProfileCrop, setCompletedProfileCrop] = useState(null);
    const [profileFileName, setProfileFileName] = useState(null);

    const [subStatus, setSubStatus] = useState(true);

    useEffect(() => {

        const count = userLinks.length;
        if ( count > 9 && userSub && userSub["braintree_status"] === "canceled" && new Date(userSub["ends_at"]).valueOf() < new Date().valueOf() )   {
            setSubStatus(false);
        } else {
            setSubStatus(true)
        }

    }, [userLinks])

    const host = window.location.origin;

    return (
        <div className="my_row page_wrap">

            <UserLinksContext.Provider value={{ userLinks, setUserLinks}} >
                <OriginalArrayContext.Provider value={{ originalArray, setOriginalArray}} >
                    <Flash />

                    <div id="upgrade_popup">
                        {showUpgradePopup &&
                            <UpgradePopup
                                optionText={optionText}
                            />
                        }
                    </div>

                    <div id="confirm_popup_link">
                        {showConfirmPopup &&
                        <ConfirmPopup
                            editID={editID}
                            setEditID={setEditID}
                            setShowConfirmPopup={setShowConfirmPopup}
                        />
                        }
                    </div>

                    <PageContext.Provider value={{ pageSettings, setPageSettings }}>
                        <div className="left_column">
                            <PageNav
                                allUserPages={allUserPages}
                                setAllUserPages={setAllUserPages}
                                userSub={userSub}
                                setShowUpgradePopup={setShowUpgradePopup}
                                setOptionText={setOptionText}
                            />

                            <div className="content_wrap" id="left_col_wrap">
                                <div className="top_section">
                                    <PageName />

                                    <PasswordProtect
                                        userSub={userSub}
                                        setShowUpgradePopup={setShowUpgradePopup}
                                        setOptionText={setOptionText}
                                    />

                                    <PageHeader
                                        setRef={ref}
                                        completedCrop={completedCrop}
                                        setCompletedCrop={setCompletedCrop}
                                        fileName={fileName}
                                        setFileName={setFileName}
                                    />

                                    <PageProfile
                                        profileRef={profileRef}
                                        completedProfileCrop={completedProfileCrop}
                                        setCompletedProfileCrop={
                                            setCompletedProfileCrop
                                        }
                                        profileFileName={profileFileName}
                                        setProfileFileName={setProfileFileName}
                                    />

                                    <PageTitle />
                                    <PageBio />

                                    <ShowPreviewButton />

                                    {subStatus ? "" :
                                        <div className="icon_message">
                                            <p>Your plan has been downgraded to Free. Your link will only display up to 8 icons max.</p>
                                            <a className="button blue" href="/plans">Upgrade</a>
                                        </div>
                                    }
                                </div>

                                <div className="my_row link_row">
                                    <div className="add_more_icons">
                                        <AddLink
                                            userSub={userSub}
                                            setShowUpgradePopup={setShowUpgradePopup}
                                            setOptionText={setOptionText}
                                        />
                                    </div>
                                    <div className="view_live_link">
                                        <a className="button green" target="_blank" href={ host + '/' + pageSettings['name'] }>Open Live Page</a>
                                    </div>
                                </div>


                                <div className="icons_wrap add_icons icons">

                                    <Links
                                        setEditID={setEditID}
                                        userSub={userSub}
                                    />

                                </div>
                                {editID ? (
                                    <SubmitForm
                                        editID={editID}
                                        setEditID={setEditID}
                                        setShowUpgradePopup={setShowUpgradePopup}
                                        setShowConfirmPopup={setShowConfirmPopup}
                                        setOptionText={setOptionText}
                                        userSub={userSub}
                                        customIconArray={customIconArray}
                                        setCustomIconArray={setCustomIconArray}
                                    />
                                ) : (
                                    ""
                                )}
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
                                userSub={userSub}
                            />
                        </div>
                    </PageContext.Provider>
                </OriginalArrayContext.Provider>
            </UserLinksContext.Provider>
        </div>
    );
}

export default App;
