import React, {useState} from 'react';
import {MdCancel, MdEdit, MdDeleteForever} from 'react-icons/md';
import IconList from './IconList';
import axios from 'axios';

const Links = ({linkItem, currentLinkID, setLinkID, currentName, setName, currentUrl, setUrl, userLinks, setUserLinks, currentIcon, setIcon, pageID, defaultIconPath}) => {

    const {id, name, url, icon} = linkItem;

    const [showIcons, setShowIcons] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [elementType, setElementType] = useState();

    const handleClick = (id, type) => {
        setLinkID(id);
        setElementType(type);
        setIsEditing(true);
    }

    console.log(id);

    const selectIcon = (e, source) => {
        e.preventDefault();

        const el = e.target;
        el.classList.add('active');

        const packets = {
            name: name,
            url: url,
            icon: source,
            page_id: pageID
        };

        if (id.toString().includes("new") ) {

            axios.post('/dashboard/links/new', packets).then(
                response => {
                    console.log(JSON.stringify(response.data.link_id));

                    const returnMessage  = JSON.stringify(response.data);
                    const linkID = returnMessage.link_id;
                    setUserLinks(
                        userLinks.map((item) => {
                            if (item.id === id) {
                                return {
                                    ...item,
                                    id: linkID,
                                    name: item.name,
                                    url: item.url,
                                    icon: source,
                                    page_id: pageID
                                }
                            }
                            return item;
                        })
                    )

                    setShowIcons(false)
                },

            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });

        } else {

            axios.post('/dashboard/links/' + id, packets).then(
                response => console.log(JSON.stringify(response.data)),
                setUserLinks(
                    userLinks.map((item) => {
                        if (item.id === id) {
                            return {
                                ...item,
                                name: item.name,
                                url: item.url,
                                icon: source
                            }
                        }
                        return item;
                    })
                ),
                setShowIcons(false)
            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });

        }
    }

    const handleSubmit = (e, clickedID) => {
        e.preventDefault();

        setLinkID(clickedID);
        let newName;
        let newUrl;

        if (elementType === "name") {
            newName = currentName;
        } else {
            newName = name;
        }

        if (elementType === "url") {
            newUrl = currentUrl;
        } else {
            newUrl = url;
        }


        const packets = {
            name: newName,
            url: newUrl,
            icon: icon,
            page_id : pageID
        };

        if (id.toString().includes("new") ) {

            axios.post('/dashboard/links/new', packets).then(
                response => {
                    console.log(JSON.stringify(response.data.link_id));

                    const returnMessage  = JSON.stringify(response.data);
                    const linkID = returnMessage.link_id;

                    setUserLinks(
                        userLinks.map((item) => {
                            if (item.id === id) {
                                return {
                                    ...item,
                                    id: linkID,
                                    name: item.name,
                                    url: item.url,
                                    icon: item.icon,
                                    page_id: pageID
                                }
                            }
                            return item;
                        })
                    )

                    setShowIcons(false)
                },

            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });

        } else {

            axios.post('/dashboard/links/' + id, packets).then(
                response => console.log(JSON.stringify(response.data)),
                setUserLinks(
                    userLinks.map((item) => {
                        if (item.id === id) {
                            return {
                                ...item,
                                name: newName,
                                url: newUrl,
                                icon: icon
                            }
                        }
                        return item;
                    })
                ),
                setLinkID(null),
                setIsEditing(false)
            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });


        }
    };

    const deleteItem = (e, clickedID) => {
        e.preventDefault();

        setLinkID(clickedID);

        setName("Link Name");
        setUrl("https://linkurl.com");
        setIcon(defaultIconPath);

        setUserLinks(
            userLinks.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        name: currentName,
                        url: currentUrl,
                        icon: currentIcon
                    }
                }
                return item;
            })
        );

        axios.delete('/dashboard/links/' + id).then(
            response => console.log(JSON.stringify(response.data)),

        ).catch(error => {
            console.log("ERROR:: ", error.response.data);
        });

    }

    return (
        <div className="link_wrap">

            {!id.toString().includes("new") ?

                <a href="#" onClick={(e) => deleteItem(e, id) }><MdDeleteForever /></a> : ""
            }

            <div className="icon_wrap">
                <img src={ icon } />
                <a href="#" onClick={(e) => setShowIcons(true) }><MdEdit /></a>
                { showIcons ? <IconList setShowIcons={setShowIcons} selectIcon={selectIcon}/> : "" }
            </div>

            <div className="my_row">
                {isEditing && elementType === "name" ?
                    <form>
                        <input type="text" defaultValue={name}
                               onChange={(e) => setName(e.target.value)}
                               onKeyPress={event => {
                                       if (event.key === 'Enter') {
                                           handleSubmit(event, id);
                                       }
                                   }
                               }
                        />
                        <a href="#" onClick={(e) => {e.preventDefault(); setIsEditing(false) } }><MdCancel /></a>
                    </form>
                    :
                    <p>{name}<a onClick={(e) => handleClick(id, "name") }><MdEdit /></a></p>
                }
            </div>
            <div className="my_row">
                {isEditing && elementType === "url" ?
                    <form>
                        <input type="text" defaultValue={url}
                               onChange={(e) => setUrl(e.target.value)}
                               onKeyPress={event => {
                                       if (event.key === 'Enter') {
                                           handleSubmit(event, id);
                                       }
                                    }
                               }
                        />
                        <a href="#" onClick={(e) => {e.preventDefault(); setIsEditing(false) } }><MdCancel /></a>
                    </form>
                    :
                    <p>{url}<a onClick={(e) => handleClick(id, "url") }><MdEdit /></a></p>
                }
            </div>


        </div>

    );
}

export default Links;
