import React, { useState, useEffect, useContext } from 'react';
import Preview from './Preview';
//import Links from './Links';
import {MdEdit} from 'react-icons/md';
//import EditForm from './EditForm';
import IconList from './IconList';
import axios from "axios";
//import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDrag, useDrop } from "react-dnd";
import myLinksArray from './LinkItems';
import DragItem from "./DragItem";
import GridContext from "./GridContext";
import { Grid, GridImage, GridItem } from "./Grid";

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
    const [editID, setEditID] = useState(null);
    //const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [linkIcon, setLinkIcon] = useState('');
    const [userInfo, setUserInfo] = useState(getUserInfo());
    const [showIcons, setShowIcons] = useState(false);

    const stringIndex = user.defaultIcon[0].search("/images");
//const end = defaultIconPath[0].search("/images");
    const defaultIconPath = user.defaultIcon[0].slice(stringIndex);
    const { items, moveItem } = useContext(GridContext);

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

            axios.post('/dashboard/links/' + editID, packets).then(
                response => alert(JSON.stringify(response.data))
            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });

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
        }

        setEditID(null);
    };

    /*const editItem = (id) => {
        const specificItem = userLinks.find((item) => item.id === id);
        setName(specificItem.name);
        setLink(specificItem.link);
        setLinkIcon(specificItem.link_icon);
    };*/

    const deleteItem = (e) => {
        e.preventDefault();

        axios.delete('/dashboard/links/' + editID).then(
            response => alert(JSON.stringify(response.data))
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);
        });

        setName(null);
        setLink(null);
        setLinkIcon(defaultIconPath);

        setEditID(null);

    }

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(userLinks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setUserLinks(items);
    }

    let count = userLinks.length;
    let loopCount = 0;

    return (
        <div className="row justify-content-center">
            <div className="col-8">
                <h2>Your Links</h2>

                <div className="icons_wrap add_icons icons">
                    <Grid key={count}>
                        {items.map((linkItem, index) => {

                            let {id, name, link, link_icon} = linkItem;

                            if (id === null) {
                                id = "new_" + (index + 1);
                            }

                            if (name === null) {
                                name = "add_new_link_" + index;
                            }

                            //loopCount++;

                            return (
                                <>
                                    <DragItem key={id} id={id} onMoveItem={moveItem}>
                                        <GridItem>
                                            {/*<Links
                                            id={id}
                                            link_icon={link_icon}
                                            setEditID={setEditID}
                                            item={linkItem}
                                            onMoveItem={moveItem}
                                        />*/}
                                            <GridImage src={ link_icon }>

                                            </GridImage>
                                        </GridItem>
                                    </DragItem>

                                    {/* {loopCount % 3 === 0 && showForm ?
                                    <div key={name + "_form"} className="edit_form" id={name + "_form"}>
                                        <EditForm
                                            handleSubmit={handleSubmit}
                                            deleteItem={deleteItem}
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

                                }*/}
                                </>


                            )

                        })}
                    </Grid>

                </div>
            </div>
            {/*<a href="/dashboard/links/new" className="btn btn-primary">Add Link</a>*/}

            <div className="col-4 preview_col">
                {/*<Preview links={userLinks} userInfo={userInfo} defaultIconPath={defaultIconPath} count={count}/>*/}
            </div>
        </div>
    );
}

const Links = ({id, name, link_icon, setEditID, linkItem, moveItem}) => {

    /*const ref = React.createRef();

    const [, connectDrag] = useDrag(() => ({
        type: "LINKS_COMPONENT",
        item: () => ({id: id, created: "10:06"}),
        /!*collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        })*!/
    }));
    const [, connectDrop] = useDrop(() => ({
        accept: "LINKS_COMPONENT",
        hover(item) {
            console.log("Hovering item. id: ", item.id, " created: ", item.created);
            console.log("Hovered over item with id: ", id);
        }
    }));
    connectDrag(ref);
    connectDrop(ref);*/



    return (
        <>
            <div key={id} className="icon_col" id={id}>

                <img src={ link_icon } />
                {/*<button onClick={(e) => setEditID(id) }><MdEdit /></button>*/}

                {/*{editID === id ?
                    <div key={name + "_form"} className="edit_form" id={name + "_form"}>
                        <EditForm
                            handleSubmit={handleSubmit}
                            deleteItem={deleteItem}
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
                }*/}

            </div>
        </>

    );
}

const EditForm = ({handleSubmit, deleteItem, editID, setEditID, currentLink, setName, setLink, setLinkIcon, showIcons, setShowIcons}) => {

    let { id, name, link, link_icon} = currentLink;

    //setName(name);
    //setLink(link);

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
                {editID && !editID.toString().includes("new") ?
                    <a href="#" onClick={(e) => deleteItem(e) }>Delete</a> : ""
                }
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
