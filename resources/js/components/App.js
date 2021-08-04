import React, { useState, useReducer, createContext } from 'react';
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

import { IoIosLock } from "react-icons/io";
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

    const [editID, setEditID] = useState("");
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
                    {/*<LinksContext.Provider value={{ userLinks, setUserLinks}} >*/}
                        <PageContext.Provider value={{ pageSettings, setPageSettings}}>
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

                                        <PageHeader />
                                        <PageProfile />
                                        <PageTitle />
                                        <PageBio />

                                        <div className="icons_wrap add_icons icons">

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
                                            { editID ?

                                                <SubmitForm editID={editID} setEditID={setEditID} setUserLinks={setUserLinks} userLinks={userLinks}/>

                                                :
                                                ""
                                            }

                                        </div>
                                    </div>

                            </div>
                            <div className="col-5 preview_col">
                                <Preview page={page} defaultIconPath={defaultIconPath} setUserLinks={setUserLinks} userLinks={userLinks}/>
                            </div>

                        </PageContext.Provider>
                    {/*</LinksContext.Provider>*/}
                </div>
            </div>
        </div>
    );
}

export default App;
