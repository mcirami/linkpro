import React, { useState, useEffect } from 'react';
import Preview from './Preview';
import Links from './Links';

const getUserLinks = () => {
    return (user.links);
}

const getUserInfo = () => {

    const userInfo = {
        'username': user.username,
        'background': user.background
    }

    return (userInfo);
}

function App() {

    const [links, setLinks] = useState(getUserLinks());
   //const [isEditing, setIsEditing] = useState(false);
    const [editID, setEditID] = useState(null);
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [linkIcon, setLinkIcon] = useState('');
    const [userInfo, setUserInfo] = useState(getUserInfo());
    const [showIcons, setShowIcons] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();
        setLinks(
            links.map((item) => {
                if (item.id === editID) {
                    return {...item, name: name, link: link, link_icon: link_icon}
                }
                return item;
            })
        );

        setEditID(null);
    };

    const editItem = (id) => {
        const specificItem = links.find((item) => item.id === id);
        setName(specificItem.name);
        setLink(specificItem.link);
        setLinkIcon(specificItem.link_icon);
    };

    return (
        <div className="row justify-content-center">
            <div className="col-8">
                <h2>Your Links</h2>
                <Links links={links}
                       handleSubmit={handleSubmit}
                       editID={editID}
                       setEditID={setEditID}
                       setName={setName}
                       setLink={setLink}
                       setLinkIcon={setLinkIcon}
                       showIcons={showIcons}
                       setShowIcons={setShowIcons}
                />
                    <a href="/dashboard/links/new" className="btn btn-primary">Add Link</a>
            </div>
            <div className="col-4 preview_col">
                <Preview links={links} userInfo={userInfo}/>
            </div>
        </div>
    );
}

export default App;
