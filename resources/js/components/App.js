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
    const [linkID, setLinkID] = useState(null);
    //const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [icon, setIcon] = useState('');
    //const [userInfo, setUserInfo] = useState(getUserInfo());

    const stringIndex = user.defaultIcon[0].search("/images");
    const defaultIconPath = user.defaultIcon[0].slice(stringIndex);

    useEffect( () => {
        if(icon){
            setIcon(icon);
        }
    },[icon])

    let count = userLinks.length;
    let loopCount = 0;

    return (
        <div className="row">
            <div className="col-12">

                <PageNav userPages={userPages} currentPage={page["id"]} />

                <div className="row justify-content-center">
                    <div className="col-8">

                        <PageName page={page}/>

                        <PageHeader page={page}/>

                        <PageProfile page={page}/>

                        <div className="icons_wrap add_icons icons">

                            {userLinks.map((linkItem, index) => {

                                return (
                                    <div key={index} className="icon_col" id={index}>
                                            <Links
                                                linkItem={linkItem}
                                                setLinkID={setLinkID}
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
                    <div className="col-4 preview_col">
                        <Preview links={userLinks} page={page} defaultIconPath={defaultIconPath} count={count}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
