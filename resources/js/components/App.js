import React, { useState, useEffect, useContext } from "react";
import Preview from "./Preview";
import Links from "./Links";
import SubmitForm from "./SubmitForm";
import axios from "axios";
import myLinksArray from "./LinkItems";
import PageHeader from "./PageHeader";
import PageProfile from "./PageProfile";
import PageName from "./PageName";
import PageNav from "./PageNav";

/*const getUserInfo = () => {

    const userInfo = {
        'username': user.username,
    }

    return (userInfo);
}*/

const page = user.page;
const userPages = user.user_pages;

function App() {
    const [userLinks, setUserLinks] = useState(myLinksArray);
    //const [linkID, setLinkID] = useState(null);
    //const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [icon, setIcon] = useState("");
    //const [userInfo, setUserInfo] = useState(getUserInfo());
    const [dragState, setDragState] = useState({ isDragging: false });

    const stringIndex = user.defaultIcon[0].search("/images");
    const defaultIconPath = user.defaultIcon[0].slice(stringIndex);

    useEffect(() => {
        if (icon) {
            setIcon(icon);
        }
    }, [icon]);

    const handleDragStart = (event) => {
        const div = event.target.closest(".icon_col");

        const onMouseMove = (event) => {
            setDragState((dragState) => ({
                ...dragState,
                xf: event.clientX,
                yf: event.clientY,
            }));
        };

        const onMouseOut = (event) => {
            console.log("mouseout fired");
            setDragState((dragState) => ({
                ...dragState,
                isDragging: false,
            }));
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseout", onMouseOut);

        setDragState((dragState) => ({
            ...dragState,
            isDragging: true,
            id: div.id,
            xi: event.clientX,
            yi: event.clientY,
        }));
    };

    return (
        <div className="row">
            <div className="col-12">
                <PageNav userPages={userPages} currentPage={page["id"]} />

                <div className="row justify-content-center">
                    <div className="col-8">
                        <PageName page={page} />

                        <PageHeader page={page} />

                        <PageProfile page={page} />

                        <div className="icons_wrap add_icons icons">
                            {userLinks.map((linkItem, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="icon_col"
                                        id={linkItem.id}
                                        onMouseDown={handleDragStart}
                                        style={{
                                            ...(dragState.isDragging &&
                                                linkItem.id == dragState.id && {
                                                    transform: `translate3d(${
                                                        dragState.xf -
                                                        dragState.xi
                                                    }px, ${
                                                        dragState.yf -
                                                        dragState.yi
                                                    }px, 0)`,
                                                }),
                                        }}
                                    >
                                        <Links
                                            linkItem={linkItem}
                                            currentName={name}
                                            setName={setName}
                                            currentUrl={url}
                                            setUrl={setUrl}
                                            currentIcon={icon}
                                            setIcon={setIcon}
                                            userLinks={userLinks}
                                            setUserLinks={setUserLinks}
                                            defaultIconPath={defaultIconPath}
                                            pageID={page["id"]}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="col-4 preview_col">
                        <Preview
                            links={userLinks}
                            page={page}
                            defaultIconPath={defaultIconPath}
                            count={userLinks.length}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
