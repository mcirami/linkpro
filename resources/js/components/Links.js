import React from 'react';
import { MdEdit } from 'react-icons/md';

const Links = ({id, name, link_icon, setLinkID, linkItem, moveItem}) => {

    return (
        <>
            <p>{name}</p>
            <img src={ link_icon } />
            <button onClick={(e) => setLinkID(id) }><MdEdit /></button>

        </>

    );
}

export default Links;
