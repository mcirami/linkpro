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
    const [link, setLink] = useState('');
    const [linkIcon, setLinkIcon] = useState('');
    //const [userInfo, setUserInfo] = useState(getUserInfo());

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

            axios.post('/dashboard/links/new', packets).then(
                response => console.log(JSON.stringify(response.data)),
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
                )
            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });

        } else {

            axios.post('/dashboard/links/' + linkID, packets).then(
                response => alert(JSON.stringify(response.data)),
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
                )
            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });


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

                                //let {id, name, link, link_icon} = linkItem;
                                //id = id.toString();
                                //loopCount++;

                                return (
                                    <div key={index} className="icon_col" id={index}>
                                            <Links
                                                linkItem={linkItem}
                                                handleSubmit={handleSubmit}
                                                setLinkID={setLinkID}
                                                setName={setName}
                                                setLink={setLink}
                                                setLinkIcon={setLinkIcon}
                                            //item={linkItem}
                                        />

                                         {/*{loopCount % 3 === 0 && showForm ?*/}
                                       {/* {linkID === id ?
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

                                    }*/}
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
