import React, {useState, useReducer, createContext, createRef, useEffect, useRef} from 'react';
import Preview from './Preview/Preview';
import Links from './Link/Links';
import SubmitForm from './Link/SubmitForm';
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

//import UserContext from './User/User';

const page = user.page;
const userPages = user.user_pages;

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
    const [pageSettings, setPageSettings] = useReducer(pageReducer, page);
    const [allUserPages, setAllUserPages] = useState(userPages);
    const [editID, setEditID] = useState(null);

    const ref = createRef(null);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [fileName, setFileName] = useState(null);

    const profileRef = createRef(null)
    const [completedProfileCrop, setCompletedProfileCrop] = useState(null);
    const [profileFileName, setProfileFileName] = useState(null);

    useEffect(() => {

    })

    /*
    * Drag and drop
    *
    * */
    const pointerRef = useRef(null);
    const [dragState, setDragState] = useState(null);
    const [showPointer, setShowPointer] = useState(false);

    const handleStart = (event) => {
        const icon = event.target.closest(".icon_col");

        icon.classList.add("dragging");

        if (icon) {
            setDragState({
                name: icon.dataset.name,
                xi: event.clientX,
                yi: event.clientY
            });
        }
    };

    const handleMove = (event) => {
        const icon = event.target.closest(".icon_col");

        if (icon && dragState) {

            const over = document.elementsFromPoint(event.clientX, event.clientY)
            .find(
                (node) =>
                    node.classList.contains("icon_col") &&
                    !node.classList.contains("dragging")
            );

            if (over) {
                setShowPointer(true);
                const { x, y, width, height} = over.getBoundingClientRect();

                console.log("x:" + x);
                console.log("y:" + y);
                console.log("width:" + width);
                console.log("height:" + height);

                if (event.clientX < x + width / 2 ) {
                    if(pointerRef.current) {
                        pointerRef.current.style.cssText = `transform: translate(${x}px, ${y}px)`;
                    }
                } else {
                    if (pointerRef.current) {
                        pointerRef.current.style.cssText = `transform: translate(${x + width}px, ${y}px)`;
                    }
                }
            }

            icon.style.cssText = `transform: translate(${event.clientX - dragState.xi}px, ${event.clientY - dragState.yi}px)`;
        }
    }

    const handleEnd = (event) => {
        const over = document.elementsFromPoint(event.clientX, event.clientY)
        .find(
            (node) =>
                node.classList.contains("icon_col") &&
                !node.classList.contains("dragging")
        );

        if (over) {
            pointerRef.current?.removeAttribute("style");
            const {x, y, width } = over.getBoundingClientRect();
            if (event.clientX < x + width / 2 ) {
                setUserLinks((links) => {
                    const index = links.findIndex(
                        (link) => over.dataset.name === link.name
                    );

                    return [
                        ...links
                        .filter((link) => link.name !== dragState.name)
                        .slice(0, index),
                        ...[links.find((link) => link.name === dragState.name)],
                        ...links.filter((link) => link.name !== dragState.name).slice(index)
                    ];
                })
            } else {
                setUserLinks((links) => {
                    const index = links.findIndex (
                        (link) => over.dataset.name === link.name
                    );
                    return [
                        ...links
                        .filter((link) => link.name !== dragState.name)
                        .slice(0, index + 1),
                        ...[links.find((link) => link.name === dragState.name)],
                        ...links
                        .filter((link) => link.name !== dragState.name)
                        .slice(index + 1)
                    ];
                })
            }
        }

        document.querySelector(".dragging").removeAttribute("style");
        document.querySelector(".dragging").classList.remove("dragging");

        setDragState(null);
        setShowPointer(false);
    }


    return (
        <div className="my_row page_wrap">
            <Flash />

            {/*<LinksContext.Provider value={{ userLinks, setUserLinks}} >*/}
            <PageContext.Provider value={{ pageSettings, setPageSettings }}>
                <div className="left_column">
                    <PageNav
                        allUserPages={allUserPages}
                        setAllUserPages={setAllUserPages}
                        currentPage={page["id"]}
                    />

                    <div className="content_wrap">
                        <div className="top_section">
                            <PageName
                                allUserPages={allUserPages}
                                setAllUserPages={setAllUserPages}
                                page={page}
                            />

                            <PasswordProtect />

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

                        <div className="icons_wrap add_icons icons"
                             onMouseDown={handleStart}
                             onMouseMove={handleMove}
                             onMouseUp={handleEnd}
                        >

                            {showPointer && <span ref={pointerRef} />}

                            {/*{userLinks.map(( linkItem, index) => {

                                    //let {id, name, link, link_icon} = linkItem;

                                    return (
                                        <>*/}
                            <Links
                                setEditID={setEditID}
                                userLinks={userLinks}
                                setUserLinks={setUserLinks}
                            />
                            {/*</>

                                    )

                                })}
*/}
                            {editID ? (
                                <SubmitForm
                                    editID={editID}
                                    setEditID={setEditID}
                                    setUserLinks={setUserLinks}
                                    userLinks={userLinks}
                                />
                            ) : (
                                ""
                            )}
                        </div>

                        <AddLink
                            userLinks={userLinks}
                            setUserLinks={setUserLinks}
                        />
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
                    />
                </div>
            </PageContext.Provider>
            {/*</LinksContext.Provider>*/}
        </div>
    );
}

export default App;
