import React, {useState} from 'react';
import {MdCancel, MdEdit, MdDeleteForever} from 'react-icons/md';
import IconList from './IconList';
import axios from 'axios';
import Switch from "react-switch";

const Links = ({linkItem, currentName, setName, currentUrl, setUrl, userLinks, setUserLinks, currentIcon, setIcon, pageID, defaultIconPath}) => {

    const {id, name, url, icon, active_status} = linkItem;

    const [showIcons, setShowIcons] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [elementType, setElementType] = useState();
    const [editID, setEditID] = useState(null);
    const [switchStatus, setSwitchStatus] = useState(active_status);

    const newLink = id.toString().includes("new");

    const handleClick = (id, type) => {
        setEditID(id);
        setElementType(type);
        setIsEditing(true);
    }

    const selectIcon = (e, source) => {
        //e.preventDefault();

        const el = e.target;
        el.classList.add('active');

        const packets = {
            name: name,
            url: url,
            icon: source,
            page_id: pageID
        };

        if (newLink) {

            axios.post('/dashboard/links/new', packets).then(
                response => {
                    console.log(JSON.stringify(response.data));
                    const link_id  = JSON.stringify(response.data.link_id);
                    setUserLinks(
                        userLinks.map((item) => {
                            if (item.id === id) {
                                return {
                                    ...item,
                                    id: link_id,
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

        setEditID(clickedID);
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

        if (newLink ) {

            axios.post('/dashboard/links/new', packets).then(
                response => {
                    console.log(JSON.stringify(response.data));
                    const link_id  = JSON.stringify(response.data.link_id);

                    setUserLinks(
                        userLinks.map((item) => {
                            if (item.id === id) {
                                return {
                                    ...item,
                                    id: link_id,
                                    name: newName,
                                    url: newUrl,
                                    icon: item.icon,
                                    page_id: pageID
                                }
                            }
                            return item;
                        })
                    );

                    setEditID(null);
                    setIsEditing(false);
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
                setEditID(null),
                setIsEditing(false)

            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });


        }
    };

    const deleteItem = (e, clickedID) => {
        e.preventDefault();

        setName("Link Name");
        setUrl("https://linkurl.com");
        setIcon(defaultIconPath);

        setUserLinks(
            userLinks.map((item) => {
                if (item.id === clickedID) {
                    return {
                        ...item,
                        id: "new_" + clickedID,
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

    const handleChange = (id) => {
        const newStatus = !switchStatus;

        setSwitchStatus(newStatus);

        const packets = {
            active_status: newStatus,
        };

        axios.post('/dashboard/links/status/' + id, packets).then(
            response => console.log(JSON.stringify(response.data)),
            setUserLinks(
                userLinks.map((item) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            active_status: newStatus
                        }
                    }
                    return item;
                })
            ),

        ).catch(error => {
            console.log("ERROR:: ", error.response.data);

        });
    }

    return (
        <>

            {!newLink ?

                <a id={id} href="#" onClick={(e) => deleteItem(e, id) }><MdDeleteForever /></a> : ""
            }

            <div className="icon_wrap">
                <img src={ icon } />
                <a href="#" onClick={(e) => setShowIcons(true) }><MdEdit /></a>
                { showIcons ? <IconList setShowIcons={setShowIcons} selectIcon={selectIcon}/> : "" }
            </div>

            <div className="my_row">
                {(isEditing && elementType === "name" && editID === id) ?
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
                        <a href="#" onClick={(e) => {e.preventDefault(); setIsEditing(false);setEditID(null) } }><MdCancel /></a>
                    </form>
                    :
                    <p>{name}<a onClick={(e) => handleClick(id, "name") }><MdEdit /></a></p>
                }
            </div>
            <div className="my_row">
                {(isEditing && elementType === "url" && editID === id) ?
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
                        <a href="#" onClick={(e) => {e.preventDefault(); setIsEditing(false);setEditID(null) } }><MdCancel /></a>
                    </form>
                    :
                    <p>{url}<a onClick={(e) => handleClick(id, "url") }><MdEdit /></a></p>
                }
            </div>
            <div className="my_row">

                <Switch onChange={(e) => handleChange(id) }
                        disabled={newLink}
                        height={20}
                        checked={Boolean(switchStatus)}
                        onColor='#424fcf'
                        uncheckedIcon={false}
                        checkedIcon={false}
                />
            </div>


        </>

    );
}

export default Links;
