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
import {MdEdit} from 'react-icons/md';

const page = user.page;
const userPages = user.user_pages;
const page_profile_path = user.page_profile_path + "/";
const page_header_path = user.page_header_path + "/";

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

    const myStyle = {
        background: "url(" + page_header_path + pageSettings["header_img"] + ") no-repeat",
        backgroundSize: "cover",

    };

    return (
        <div className="row">
            <div className="col-12">

                <div className="row justify-content-center">
                    <div className="col-12">

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

                            <div className="preview_wrap preview_col">
                                <div className="inner_content">

                                    {pageSettings["header_img"] ?
                                        <div className="page_header"
                                             style={myStyle}
                                        >
                                        </div>
                                        :
                                        <div className={!pageSettings["header_img"] ? "page_header default" : "page_header" }>
                                            <MdEdit />
                                        </div>
                                    }
                                    <div className="profile_content">
                                        <div className={!pageSettings["profile_img"] ? "profile_image default" : "profile_image"  }>
                                            {pageSettings["profile_img"] ?
                                                <img src={page_profile_path + pageSettings["profile_img"]} alt=""/>
                                                :
                                                <MdEdit />
                                            }
                                        </div>
                                        <div className="profile_text">
                                            <h2>{pageSettings["title"]}</h2>
                                            <p>{pageSettings["bio"]}</p>
                                        </div>
                                    </div>

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
                        </div>
                    </div>
                    {/*<div className="col-5 preview_col">
                        <LinksContext.Provider value={{ userLinks, setUserLinks}} >
                            <PageContext.Provider value={{ pageSettings, setPageSettings}}>
                                <Preview page={page} defaultIconPath={defaultIconPath} />
                            </PageContext.Provider>
                        </LinksContext.Provider>
                    </div>*/}
                </div>
            </div>
        </div>
    );
}

export default App;
