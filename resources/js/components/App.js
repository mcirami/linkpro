import React, { useState, useEffect, useContext } from 'react';
import Preview from './Preview';
import Links from './Links';
import SubmitForm from './SubmitForm';
import axios from "axios";
import myLinksArray from './LinkItems';
import PageHeader from './PageHeader';
import PageProfile from './PageProfile';
import PageName from './PageName';
import PageNav from './PageNav';
import { IoIosLock } from "react-icons/io";

const page = user.page;
const userPages = user.user_pages;

function App() {

    const [userLinks, setUserLinks] = useState(myLinksArray);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [icon, setIcon] = useState('');

    const stringIndex = user.defaultIcon[0].search("/images");
    const defaultIconPath = user.defaultIcon[0].slice(stringIndex);

    return (
        <div className="row">
            <div className="col-12">

                <div className="row justify-content-center">
                    <div className="col-8">

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

                            <PageHeader page={page}/>

                            <PageProfile page={page}/>

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
                    <div className="col-4 preview_col">
                        <Preview links={userLinks} page={page} defaultIconPath={defaultIconPath} count={userLinks.length}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
