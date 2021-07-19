import React, { useState, useEffect, useContext } from 'react';
import Preview from './Preview';
//import Links from './Links';
import {MdEdit} from 'react-icons/md';
//import EditForm from './EditForm';
import IconList from './IconList';
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import myLinksArray from './LinkItems';
import ServiceCommandUnit from "./ServiceCommandUnit";

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


// a little function to help us with reordering the result
/*
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 200
});
*/

function App() {

    const [userLinks, setUserLinks] = useState(myLinksArray);
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
        console.log(result);
        const items = Array.from(userLinks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setUserLinks(items);

    }

    let count = userLinks.length;
    let loopCount = 0;

    /*const onDragEnd = (result) => {
        // dropped outside the list
        console.log(result);
        console.log("innner drag");
        if (!result.destination) {
            return;
        }
        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;
        if (result.type === "droppableItem") {
            const items = reorder(userLinks, sourceIndex, destIndex);

            setUserLinks({
                items
            });
        } else if (result.type === "droppableSubItem") {
            const itemSubItemMap = userLinks.reduce((acc, item) => {
                acc[item.id] = item.subItems;
                return acc;
            }, {});

            const sourceParentId = parseInt(result.source.droppableId);
            const destParentId = parseInt(result.destination.droppableId);

            const sourceSubItems = itemSubItemMap[sourceParentId];
            const destSubItems = itemSubItemMap[destParentId];

            let newItems = [...userLinks];

            /!** In this case subItems are reOrdered inside same Parent *!/
            if (sourceParentId === destParentId) {
                const reorderedSubItems = reorder(
                    sourceSubItems,
                    sourceIndex,
                    destIndex
                );
                newItems = newItems.map(item => {
                    if (item.id === sourceParentId) {
                        item.subItems = reorderedSubItems;
                    }
                    return item;
                });
                setUserLinks({
                    items: newItems
                });
            } else {
                let newSourceSubItems = [...sourceSubItems];
                const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

                let newDestSubItems = [...destSubItems];
                newDestSubItems.splice(destIndex, 0, draggedItem);
                newItems = newItems.map(item => {
                    if (item.id === sourceParentId) {
                        item.subItems = newSourceSubItems;
                    } else if (item.id === destParentId) {
                        item.subItems = newDestSubItems;
                    }
                    return item;
                });
                setUserLinks({
                    items: newItems
                });
            }
        }
    }*/

    return (
        <div className="row justify-content-center">
            <div className="col-8">
                <h2>Your Links</h2>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="icons">
                        {(provided) => (
                            <div className="icons_wrap add_icons icons" {...provided.droppableProps} ref={provided.innerRef}>

                                {userLinks.map((linkItem, index) => {

                                    let {id, name, link, link_icon} = linkItem;
                                    id = id.toString();
                                    //loopCount++;

                                    return (
                                        <Draggable key={id} draggableId={id} index={index}>
                                            {(provided) => (
                                                <div className="icon_col" id={id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <Links
                                                        id={id}
                                                        link_icon={link_icon}
                                                        setEditID={setEditID}
                                                        name={name}
                                                        //item={linkItem}
                                                    />


                                                    {/*{loopCount % 3 === 0 && showForm ?*/}
                                                    {editID === id ?
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

                                                    }
                                                </div>
                                            )}
                                        </Draggable>
                                    )

                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            <div className="col-4 preview_col">
                <Preview links={userLinks} userInfo={userInfo} defaultIconPath={defaultIconPath} count={count}/>
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
            <p>{name}</p>
            <img src={ link_icon } />
            <button onClick={(e) => setEditID(id) }><MdEdit /></button>

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
