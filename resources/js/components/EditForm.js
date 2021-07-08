import React from 'react';
import {MdEdit} from 'react-icons/md';
import IconList from './IconList';

const EditForm = ({handleSubmit, currentLink, setName, setLink, setLinkIcon, showIcons, setShowIcons}) => {
    let { id, name, link, link_icon} = currentLink;

    return (
        <div>
            <form onSubmit={handleSubmit} className="links_forms">
                <div className="row">
                    <div className="col-4">
                        <img src={link_icon} name="link_icon" alt="" />
                        <input id="current_icon"  type="text" hidden value={link_icon} onChange={(e) => setLinkIcon(e.target.value) }/>
                        <a href="#" onClick={(e) => setShowIcons(true) }>Change Icon</a>
                        { showIcons ? <IconList setShowIcons={setShowIcons} /> : "" }
                    </div>
                    <div className="col-8">
                        <input name="name" type="text" defaultValue={name} onChange={(e) => setName(e.target.value) } />
                        <input name="link" type="text" defaultValue={link} onChange={(e) => setLink(e.target.value) }/>
                    </div>
                </div>
                <button type="submit">Update</button>
                <a href="#">Cancel</a>
            </form>
        </div>

    );
}

export default EditForm;
