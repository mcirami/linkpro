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
//import UserContext from './User/User';

const page = user.page;
const userPages = user.user_pages;
const userSub = user.userSub;
const customIcons = user.userIcons;
//export const LinksContext = createContext();
export const PageContext = createContext();

/*function linksReducer(state, item) {
    return [...state, ...item]
}*/

function pageReducer(state, item) {
    return item
}

function App() {

    //const myLinksArray = useContext(UserContext);

    const [userLinks, setUserLinks] = useState(myLinksArray);
    const [originalArray, setOriginalArray] = useState(myLinksArray);
    const [pageSettings, setPageSettings] = useReducer(pageReducer, page);
    const [allUserPages, setAllUserPages] = useState(userPages);
    const [editID, setEditID] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [optionText, setOptionText] = useState("");
    const [customIconArray, setCustomIconArray] = useState(customIcons);

    const ref = createRef(null);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [fileName, setFileName] = useState(null);

    const profileRef = createRef(null)
    const [completedProfileCrop, setCompletedProfileCrop] = useState(null);
    const [profileFileName, setProfileFileName] = useState(null);

    const [wrapHeight, setWrapHeight] = useState(null);

    const [subStatus, setSubStatus] = useState(true);

    useEffect(() => {
        const iconsWrap = document.querySelector('.icons_wrap');
        const iconCol = document.querySelectorAll('.add_icons .icon_col:last-child');
        const colHeight = iconCol[0].offsetHeight;
        const transformProp = iconCol[0].style.transform.split("translate3d(");
        const transformValues = transformProp[1].split(" ");
        const divHeight = transformValues[1].replace(",", "").replace("px", "");
        const height = parseInt(divHeight) + colHeight + 120;
        iconsWrap.style.minHeight = height + "px";
        setWrapHeight(height);

    }, [])

    useEffect(() => {

        function handleResize() {
            const iconsWrap = document.querySelector('.icons_wrap');
            const iconCol = document.querySelectorAll('.add_icons .icon_col:last-child');
            const colHeight = iconCol[0].offsetHeight;
            const transformProp = iconCol[0].style.transform.split("translate3d(");
            const transformValues = transformProp[1].split(" ");
            const divHeight = transformValues[1].replace(",", "").replace("px", "");
            const height = parseInt(divHeight) + colHeight + 75;
            iconsWrap.style.minHeight = height + "px";
            setWrapHeight(height);
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    });

    useEffect(() => {

        const count = userLinks.length;
        if ( count > 9 && userSub && userSub["braintree_status"] === "canceled" && new Date(userSub["ends_at"]).valueOf() < new Date().valueOf() )   {
            setSubStatus(false);
        } else {
            setSubStatus(true)
        }

    }, [userLinks])

    return (
        <div className="my_row page_wrap">
            <Flash />

            <div id="upgrade_popup">
                {showPopup &&
                    <UpgradePopup
                        optionText={optionText}
                    />
                }
            </div>

            {/*<LinksContext.Provider value={{ userLinks, setUserLinks}} >*/}
            <PageContext.Provider value={{ pageSettings, setPageSettings }}>
                <div className="left_column">
                    <PageNav
                        allUserPages={allUserPages}
                        setAllUserPages={setAllUserPages}
                        userSub={userSub}
                        setShowPopup={setShowPopup}
                        setOptionText={setOptionText}
                    />

                    <div className="content_wrap" id="left_col_wrap">
                        <div className="top_section">
                            <PageName />

                            <PasswordProtect
                                userSub={userSub}
                                setShowPopup={setShowPopup}
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
                        </div>

                        <ShowPreviewButton />
                        <div className="add_more_icons">
                            <AddLink
                                userLinks={userLinks}
                                setUserLinks={setUserLinks}
                                originalArray={originalArray}
                                setOriginalArray={setOriginalArray}
                                userSub={userSub}
                                setShowPopup={setShowPopup}
                                setOptionText={setOptionText}
                            />
                            {subStatus ? "" :
                                <div className="icon_message">
                                    <p>Your plan has been downgraded to Free.</p>
                                    <p>Your link will only display up to 9 icons max.</p>
                                </div>
                            }
                        </div>

                        <div className="icons_wrap add_icons icons">

                            <Links
                                editID={editID}
                                setEditID={setEditID}
                                userLinks={userLinks}
                                setUserLinks={setUserLinks}
                                originalArray={originalArray}
                                setOriginalArray={setOriginalArray}
                            />

                        </div>
                        {editID ? (
                            <SubmitForm
                                editID={editID}
                                setEditID={setEditID}
                                setUserLinks={setUserLinks}
                                userLinks={userLinks}
                                originalArray={originalArray}
                                setOriginalArray={setOriginalArray}
                                setShowPopup={setShowPopup}
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
                        userLinks={userLinks}
                        fileName={fileName}
                        profileFileName={profileFileName}
                        userSub={userSub}
                    />
                </div>
            </PageContext.Provider>
            {/*</LinksContext.Provider>*/}
        </div>
    );
}

export default App;
