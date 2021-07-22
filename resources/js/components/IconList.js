import React from 'react';
import { MdClose } from 'react-icons/md';
import axios from 'axios';

const IconLinks = ({setShowIcons, selectIcon}) => {
    const iconpaths = user.icons;

    return (
        <div className="icon_popup">
            <a href="#" className="close_popup" onClick={(e) => setShowIcons(false) }><MdClose /></a>
            <div className="icon_box">
                <h3>Change Link Icon</h3>
                <div className="icons_wrap">
                    {iconpaths.map((iconPath, index) => {
                        let end = iconPath.search("/images");
                        let newPath = iconPath.slice(end);

                        return (
                            <div key={index} className="icon_col">
                                <img className="img-fluid icon_image" src={ newPath } onClick={(e) => {e.preventDefault(); selectIcon(e, newPath)} }/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    );
}

export default IconLinks;
