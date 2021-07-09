import React from 'react';
import ReactDOM from 'react-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import EditForm from './EditForm';

const Links = ({links, handleSubmit, editID, setEditID, setName, setLink, setLinkIcon, showIcons, setShowIcons}) => {

    return (
        <div className="icons_wrap">

            {links.map((linkItem) => {
                const { id, name, link, link_icon } = linkItem;


                return (
                    <div key={id} className="icon_col">
                        <img src={ link_icon} />
                        <button onClick={(e) => setEditID(id) }><MdEdit /></button>
                        { editID === id ?
                            <EditForm
                                setEditID={setEditID}
                            handleSubmit={handleSubmit}
                            currentLink={linkItem}
                            setName={setName}
                            setLink={setLink}
                            setLinkIcon={setLinkIcon}
                            showIcons={showIcons}
                            setShowIcons={setShowIcons}/> : ""
                        }
                    </div>
                )
            })}
        </div>

    );
}

export default Links;
