import React, { useState, useReducer, createContext, useRef } from 'react';
import Preview from './Preview';
import Links from './Link/Links';
import SubmitForm from './SubmitForm';
import myLinksArray from './Link/LinkItems';
import PageHeader from './Page/PageHeader';
import PageProfile from './Page/PageProfile';
import PageName from './Page/PageName';
import PageNav from './Page/PageNav';
import PageTitle from './Page/PageTitle';
import PageBio from './Page/PageBio';
import AddLink from './Link/AddLink';
import PasswordProtect from './Page/PasswordProtect';

import { IoIosLock } from "react-icons/io";
import {icons} from 'react-icons';
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

    const [editID, setEditID] = useState(null);
    //const [userLinks, setUserLinks] = useState(myLinksArray);
    /*const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [icon, setIcon] = useState('');
*/
    const stringIndex = user.defaultIcon[0].search("/images");
    const defaultIconPath = user.defaultIcon[0].slice(stringIndex);

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
                const { x, y, width} = over.getBoundingClientRect();

                console.log(x, width);
                console.log(event.clientX);

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
        <div className="row">
            <div className="col-12">

                <div className="row justify-content-center">
                    {/*<LinksContext.Provider value={{ userLinks, setUserLinks}} >*/}
                        <PageContext.Provider value={{ pageSettings, setPageSettings}}>
                            <div className="col-7 pr-5">

                                <PageNav userPages={userPages} currentPage={page["id"]} />

                                <div className="content_wrap">

                                    <PageName page={page}/>

                                    <PasswordProtect />

                                    <PageHeader />
                                    <PageProfile />
                                    <PageTitle />
                                    <PageBio />

                                    <div className="bottom_section">

                                        <div className="icons_wrap add_icons icons"
                                            onMouseDown={handleStart}
                                             onMouseMove={handleMove}
                                             onMouseUp={handleEnd}
                                        >
                                            {showPointer && <span className="pointer_ref" ref={pointerRef} />}

                                            {/*{userLinks.map(( linkItem, index) => {

                                                //let {id, name, link, link_icon} = linkItem;

                                                return (
                                                    <>*/}
                                                        <Links
                                                            setEditID={setEditID}
                                                            defaultIconPath={defaultIconPath}
                                                            userLinks={userLinks}
                                                            setUserLinks={setUserLinks}
                                                        />
                                                    {/*</>

                                                )

                                            })}
    */}


                                        </div>

                                        { editID ?

                                            <SubmitForm editID={editID} setEditID={setEditID} setUserLinks={setUserLinks} userLinks={userLinks}/>

                                            :
                                            ""
                                        }
                                    </div>

                                    <AddLink userLinks={userLinks} setUserLinks={setUserLinks} defaultIcon={defaultIconPath} />

                                </div>

                            </div>
                            <div className="col-5 links_col preview">
                                {/*<Preview page={page} defaultIconPath={defaultIconPath} userLinks={userLinks} />*/}
                            </div>

                        </PageContext.Provider>
                    {/*</LinksContext.Provider>*/}
                </div>
            </div>
        </div>
    );
}

export default App;
