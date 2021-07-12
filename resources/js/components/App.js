import React, { useState, useEffect } from 'react';
import Preview from './Preview';
//import Links from './Links';
import {MdEdit} from 'react-icons/md';
//import EditForm from './EditForm';
import IconList from './IconList';
import axios from "axios";

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
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [linkIcon, setLinkIcon] = useState('');
    const [userInfo, setUserInfo] = useState(getUserInfo());
    const [showIcons, setShowIcons] = useState(false);

    const stringIndex = user.defaultIcon[0].search("/images");
    //const end = defaultIconPath[0].search("/images");
    const defaultIconPath = user.defaultIcon[0].slice(stringIndex);

    //let nextLinkID = user.nextLinkId;


    useEffect( () => {
        if(linkIcon){
            setLinkIcon(linkIcon);
        }
    },[linkIcon])

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            name: name,
            link: link,
            link_icon: link_icon.src,
        };

        if (editID.toString().includes("new") ) {
            setUserLinks([
                ...userLinks,
                {
                    name: name,
                    link: link,
                    link_icon: link_icon.src
                }
            ]);

            axios.post('/dashboard/links/new', packets).then(
                response => alert(JSON.stringify(response.data))
            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });

        } else {
            setUserLinks(
                userLinks.map((item) => {
                    if (item.id === editID) {
                        return {
                            ...item,
                            name: name,
                            link: link,
                            link_icon: link_icon.src
                        }
                    }
                    return item;
                })
            );

            axios.post('/dashboard/links/' + editID, packets).then(
                response => alert(JSON.stringify(response.data))
            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });
        }

        setEditID(null);
    };

    const editItem = (id) => {
        const specificItem = userLinks.find((item) => item.id === id);
        setName(specificItem.name);
        setLink(specificItem.link);
        setLinkIcon(specificItem.link_icon);
    };
    let count = userLinks.length;

    let myLinksArray = [];
    for (let n = 0; n < 9 ; n++) {

        if (userLinks[n] !== undefined) {
            myLinksArray.push({
                id: userLinks[n].id,
                name: userLinks[n].name,
                link: userLinks[n].link,
                link_icon: userLinks[n].link_icon,
            })
        } else {
            myLinksArray.push({
                id: null,
                name: null,
                link: null,
                link_icon: defaultIconPath,
            })
        }
    }

    var formArray = [];

    return (
        <div className="row justify-content-center">
            <div className="col-8">
                <h2>Your Links</h2>
                <div className="icons_wrap add_icons">

                    {myLinksArray.map((linkItem, index) => {

                        let {id, name, link, link_icon} = linkItem;

                        if (id === null) {
                            id = "new_" + index;
                        }

                        if (name === null) {
                            name = "add_new_link_" + index;
                        }

                       /* if (loopCount % 3 === 0) {
                            formArray = [];
                        }

                        formArray.push({
                            id: id,
                            name: name,
                            link: link,
                            link_icon: link_icon,
                        });


                        loopCount++;*/

                        return (

                            <div key={id} className="icon_col">

                                <div key={name} className="col_top">
                                    <Links
                                        id={id}
                                        link_icon={link_icon}
                                        setEditID={setEditID}
                                        setShowForm={setShowForm}
                                    />
                                </div>

                                {editID === id ?
                                    <div key={name + "form"} className="col_bottom">
                                        <EditForm
                                            handleSubmit={handleSubmit}
                                            setEditID={setEditID}
                                            editID={editID}
                                            currentLink={linkItem}
                                            setName={setName}
                                            setLink={setLink}
                                            setLinkIcon={setLinkIcon}
                                            showIcons={showIcons}
                                            setShowIcons={setShowIcons}

                                        />
                                    </div>
                                        : ""

                                }
                            </div>
                        )

                    })}

                    {/*{count < 9 ?
                       <DefaultIcon count={count}
                                    defaultIconPath={newPath}
                                    nextLinkID={nextLinkID}
                                    handleSubmit={handleSubmit}
                                    setEditID={setEditID}
                                    setName={setName}
                                    setLink={setLink}
                                    setLinkIcon={setLinkIcon}
                                    showIcons={showIcons}
                                    setShowIcons={setShowIcons}/>
                        : ""
                    }*/}

                </div>
            </div>
                    {/*<a href="/dashboard/links/new" className="btn btn-primary">Add Link</a>*/}

            <div className="col-4 preview_col">
                <Preview links={userLinks} userInfo={userInfo} defaultIconPath={defaultIconPath} count={count}/>
            </div>
        </div>
    );
}

const Links = ({id, link_icon, setEditID}) => {

    return (
        <>
            <img src={ link_icon } />
            <button onClick={(e) => setEditID(id) }><MdEdit /></button>
        </>

    );
}

const EditForm = ({handleSubmit, editId, setEditID, currentLink, setName, setLink, setLinkIcon, showIcons, setShowIcons}) => {

    let { id, name, link, link_icon} = currentLink;

    return (

        <div className="edit_form">
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
                <a href="#" onClick={() => setEditID(null)}>Cancel</a>
            </form>
        </div>

    );
}
/*

const DefaultIcon = ({count, defaultIconPath, nextLinkID, handleSubmit, setName, setLink, setLinkIcon, showIcons, setShowIcons}) => {


    let idArray = [];
    let n = 9 - count;
    for (n; n > 0; n--) {

        idArray.push({
            id: nextLinkID
        })
        nextLinkID++;
    }

    return (
        <>
             {idArray.map((item) => {
                 return(
                     <div id={item.id} key={item.id} className="icon_col">
                        <Links
                            id={item.id}
                            link_icon={defaultIconPath}
                            setEditID={item.id}
                        />
                    </div>
                 )}
            )}
        </>

    )
}

const AddNewIconForm = ({handleChange, handleSubmit, defaultIconPath, setName, setLink, setLinkIcon, showIcons, setShowIcons}) => {

    return (
        <>
            <form onSubmit={handleSubmit} className="links_forms">
                <div className="row">
                    <div className="col-4">
                        {/!*<input name="name" type="file" onChange={(e) => handleChange(e) }/>*!/}
                        <img id="current_icon" src={link_icon} name="link_icon" alt=""/>

                        <a href="#" onClick={(e) => setShowIcons(true) }>Select Icon</a>
                        { showIcons ? <IconList setShowIcons={setShowIcons} /> : "" }
                    </div>
                    <div className="col-8">
                        <input name="name" type="text" defaultValue={name} onChange={(e) => setName(e.target.value) } />
                        <input name="link" type="text" defaultValue={link} onChange={(e) => setLink(e.target.value) }/>
                    </div>
                </div>
                <button type="submit">Add Icon</button>
                <a href="#" onClick={() => setEditID(null) }>Cancel</a>
            </form>
        </>
    );
}
*/

export default App;
