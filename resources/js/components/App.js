import React, { useState, useEffect } from 'react';
import Preview from './Preview';
//import Links from './Links';
import {MdEdit} from 'react-icons/md';
//import EditForm from './EditForm';
import IconList from './IconList';

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

    const [userLinks, setUserLinks] = useState(getUserLinks());
   //const [isEditing, setIsEditing] = useState(false);
    const [editID, setEditID] = useState(null);
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [linkIcon, setLinkIcon] = useState('');
    const [userInfo, setUserInfo] = useState(getUserInfo());
    const [showIcons, setShowIcons] = useState(false);

    useEffect( () => {
        if(linkIcon){
            setLinkIcon(linkIcon);
        }
    },[linkIcon])

    const handleSubmit = (e) => {
        e.preventDefault();
        setUserLinks(
            userLinks.map((item) => {
                if (item.id === editID) {

                    return {...item, name: name, link: link, link_icon: link_icon.src}
                }
                return item;
            })
        );

        setEditID(null);
    };

    const editItem = (id) => {
        const specificItem = userLinks.find((item) => item.id === id);
        setName(specificItem.name);
        setLink(specificItem.link);
        setLinkIcon(specificItem.link_icon);
    };

    return (
        <div className="row justify-content-center">
            <div className="col-8">
                <h2>Your Links</h2>
                <div className="icons_wrap">

                    {userLinks.map((linkItem) => {

                        const { id, name, link, link_icon } = linkItem;
                        return (
                            <div key={id} className="icon_col">
                                <Links
                                    id={id}
                                    link_icon={link_icon}
                                    setEditID={setEditID}
                                />
                                { editID === id ?
                                    <EditForm
                                        handleSubmit={handleSubmit}
                                        setEditID={setEditID}
                                        currentLink={linkItem}
                                        setName={setName}
                                        setLink={setLink}
                                        setLinkIcon={setLinkIcon}
                                        showIcons={showIcons}
                                        setShowIcons={setShowIcons}

                                    /> : "" }
                            </div>
                        )
                    })}
                </div>
            </div>
                    {/*<a href="/dashboard/links/new" className="btn btn-primary">Add Link</a>*/}

            <div className="col-4 preview_col">
                <Preview links={userLinks} userInfo={userInfo}/>
            </div>
        </div>
    );
}

const Links = ({id, link_icon, setEditID}) => {

    return (
        <>
            <img src={ link_icon} />
            <button onClick={(e) => setEditID(id) }><MdEdit /></button>
        </>

    );
}

const EditForm = ({handleChange, handleSubmit, setEditID, currentLink, setName, setLink, setLinkIcon, showIcons, setShowIcons}) => {
    let { id, name, link, link_icon} = currentLink;

    return (
        <>
            <form onSubmit={handleSubmit} className="links_forms">
                <div className="row">
                    <div className="col-4">
                        {/*<input name="name" type="file" onChange={(e) => handleChange(e) }/>*/}
                        <img id="current_icon" src={link_icon} name="link_icon" alt=""/>

                        <a href="#" onClick={(e) => setShowIcons(true) }>Change Icon</a>
                        { showIcons ? <IconList setShowIcons={setShowIcons} /> : "" }
                    </div>
                    <div className="col-8">
                        <input name="name" type="text" defaultValue={name} onChange={(e) => setName(e.target.value) } />
                        <input name="link" type="text" defaultValue={link} onChange={(e) => setLink(e.target.value) }/>
                    </div>
                </div>
                <button type="submit">Update</button>
                <a href="#" onClick={() => setEditID(null) }>Cancel</a>
            </form>
        </>
    );
}


export default App;
