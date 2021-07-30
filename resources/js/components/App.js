import React, { useState, useReducer, useEffect, createContext } from 'react';
import Preview from './Preview';
import Links from './Link/Links';
import SubmitForm from './SubmitForm';
import myLinksArray from './Link/LinkItems';
import PageHeader from './Page/PageHeader';
import PageProfile from './Page/PageProfile';
import PageName from './Page/PageName';
import PageNav from './Page/PageNav';
import { IoIosLock } from "react-icons/io";
import UserContext from './User/User';

const page = user.page;
const userPages = user.user_pages;

export const LinksContext = createContext();
export const PageContext = createContext();

function reducer(state, item) {
    return [...state, item]
}

function reducer2(state, item) {
    return [item]
}

function App() {

    //const myLinksArray = useContext(UserContext);

    const [userLinks, setUserLinks] = useReducer(reducer, myLinksArray);
    const [pageSettings, setPageSettings] = useReducer(reducer2, page);

    //const [userLinks, setUserLinks] = useState(myLinksArray);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [icon, setIcon] = useState('');

    const stringIndex = user.defaultIcon[0].search("/images");
    const defaultIconPath = user.defaultIcon[0].slice(stringIndex);

    return (
        <div className="row">
            <div className="col-12">

                <div className="row justify-content-center">
                    <div className="col-7 pr-5">

                        <PageNav userPages={userPages} currentPage={page["id"]} />

                        <div className="content_wrap">

                            <PageName page={page}/>

                            <div className="row page_settings">
                                <div className="col-12">
                                    <div className="column_wrap">
                                        <div className="column_content">
                                            <h3>Password Protect</h3>
                                            <a className="lock_icon" href="#"><IoIosLock /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <PageContext.Provider value={{ pageSettings, setPageSettings}}>
                                <PageHeader />
                                <PageProfile page={page}/>
                            </PageContext.Provider>

                            <div className="icons_wrap add_icons icons">

                                {userLinks.map((linkItem, index) => {

                                    return (
                                        <div key={index} className="icon_col" id={index}>
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
                                    )

                                })}

                            </div>
                        </div>
                    </div>
                    <div className="col-5 preview_col">
                        <LinksContext.Provider value={{ userLinks, setUserLinks}} >
                            <PageContext.Provider value={{ pageSettings, setPageSettings}}>
                                <Preview page={page} defaultIconPath={defaultIconPath} />
                            </PageContext.Provider>
                        </LinksContext.Provider>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
