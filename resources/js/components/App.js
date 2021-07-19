import React, { useState, useEffect, useContext } from 'react';
import Preview from './Preview';
import Links from './Links';
import SubmitForm from './SubmitForm';
import axios from "axios";
import myLinksArray from './LinkItems';
import PageHeader from './PageHeader';

const getUserInfo = () => {

    const userInfo = {
        'username': user.username,
    }

    return (userInfo);
}

const page = user.page;


function App() {

    const [userLinks, setUserLinks] = useState(myLinksArray);
    const [linkID, setLinkID] = useState(null);
    //const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [linkIcon, setLinkIcon] = useState('');
    const [userInfo, setUserInfo] = useState(getUserInfo());
    const [showIcons, setShowIcons] = useState(false);

    const stringIndex = user.defaultIcon[0].search("/images");
    const defaultIconPath = user.defaultIcon[0].slice(stringIndex);

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
            page_id : page["id"]
        };

        if (linkID.toString().includes("new") ) {
            setUserLinks(
                userLinks.map((item) => {
                    if (item.id === linkID) {
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

            axios.post('/dashboard/links/new', packets).then(
                response => console.log(JSON.stringify(response.data))
            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });

        } else {

            axios.post('/dashboard/links/' + linkID, packets).then(
                response => alert(JSON.stringify(response.data))
            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });

            setUserLinks(
                userLinks.map((item) => {
                    if (item.id === linkID) {
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
        }

        setLinkID(null);
    };

    const deleteItem = (e) => {
        e.preventDefault();

        axios.delete('/dashboard/links/' + linkID).then(
            response => alert(JSON.stringify(response.data))
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);
        });

        setName(null);
        setLink(null);
        setLinkIcon(defaultIconPath);

        setLinkID(null);

    }

    let count = userLinks.length;
    let loopCount = 0;

    return (
        <div className="row justify-content-center">
            <div className="col-8">

                <PageHeader page={page}/>

                <div className="icons_wrap add_icons icons">

                    {userLinks.map((linkItem, index) => {

                        let {id, name, link, link_icon} = linkItem;
                        //id = id.toString();
                        //loopCount++;

                        return (
                            <div key={id} className="icon_col" id={id}>
                                    <Links
                                    id={id}
                                    link_icon={link_icon}
                                    setLinkID={setLinkID}
                                    name={name}
                                    //item={linkItem}
                                />

                                 {/*{loopCount % 3 === 0 && showForm ?*/}
                                {linkID === id ?
                                <div key={name + "_form"} className="edit_form" id={name + "_form"}>
                                    <SubmitForm
                                        handleSubmit={handleSubmit}
                                        deleteItem={deleteItem}
                                        setLinkID={setLinkID}
                                        linkID={linkID}
                                        currentLink={linkItem}
                                        setName={setName}
                                        setLink={setLink}
                                        setLinkIcon={setLinkIcon}
                                        showIcons={showIcons}
                                        setShowIcons={setShowIcons}
                                        page={page}

                                    />
                                </div>
                                : ""

                            }
                            </div>
                        )

                    })}

                </div>
            </div>
            <div className="col-4 preview_col">
                <Preview links={userLinks} userInfo={userInfo} defaultIconPath={defaultIconPath} count={count}/>
            </div>
        </div>
    );
}

export default App;
