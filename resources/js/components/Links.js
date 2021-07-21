import React, {useState} from 'react';
import {MdCancel, MdEdit} from 'react-icons/md';
import IconList from './IconList';
import axios from 'axios';

const Links = ({linkItem, handleSubmit, setLinkID, setName, setLink, setLinkIcon}) => {

    const {id, name, link, link_icon} = linkItem;

    const [showIcons, setShowIcons] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [elementEditing, setElementEditing] = useState();

    const handleClick = (id, name) => {
        setLinkID(id);
        setElementEditing(name);
        setIsEditing(true);
    }
    return (
        <>

            <div className="icon_wrap">
                <img src={ link_icon } />
                <a href="#" onClick={(e) => setShowIcons(true) }><MdEdit /></a>
                { showIcons ? <IconList setShowIcons={setShowIcons} /> : "" }
            </div>

            <div className="my_row">
                {isEditing ?
                    <form>
                        <input type="text" defaultValue={name}
                               onChange={(e) => setName(e.target.value)}
                               onKeyPress={event => {
                                       if (event.key === 'Enter') {
                                           handleSubmit(event);
                                       }
                                   }
                               }
                        />
                        <a href="#" onClick={(e) => {e.preventDefault(); setIsEditing(false) } }><MdCancel /></a>
                    </form>
                    :
                    <p>{name}<a onClick={(e) => handleClick(id, name) }><MdEdit /></a></p>
                }
            </div>
            <div className="myrow">
                {isEditing ?
                    <form>
                        <input type="text" defaultValue={link}
                               onChange={(e) => setLink(e.target.value)}
                               onKeyPress={event => {
                                   if (event.key === 'Enter') {
                                       handleSubmit(event);
                                   }
                               }
                               }
                        />
                        <a href="#" onClick={(e) => {e.preventDefault(); setIsEditing(false) } }><MdCancel /></a>
                    </form>
                    :
                    <p>{link}<a onClick={(e) => handleClick(id, name) }><MdEdit /></a></p>
                }
            </div>


        </>

    );
}

export default Links;
