import React from 'react';
import { MdClose } from 'react-icons/md';

const IconLinks = ({setShowIcons}) => {
    const iconpaths = user.icons;

    const selectIcon = (e, source) => {
        const el = e.target;
        const image = document.getElementById('current_icon');

        if(!el.classList.contains('active')) {
            $('.icon_image').removeClass('active');
            el.classList.add('active');
            image.src = source;

        } else {
            el.classList.remove('active');
            image.src = "";
        }
    }

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
                                <img className="img-fluid icon_image" onClick={(e) => selectIcon(e, newPath) } src={ newPath } />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    );
}

export default IconLinks;
