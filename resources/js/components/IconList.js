import React, {useContext, useState} from 'react';
import {LinksContext} from './App';

const IconList = ({currentLink, setCurrentLink}) => {
    const iconpaths = user.icons;

    //const  { userLinks, setUserLinks } = useContext(LinksContext);

    const selectIcon = (e, source) => {
        const el = e.target;

        if(!el.classList.contains('active')) {
            $('.icon_image').removeClass('active');
            el.classList.add('active');
            /*setUserLinks(
                userLinks.map((item) => {
                    console.log(item);
                    if (item.id && item.id === editID) {
                        return {
                            ...item,
                            icon: source,
                        };
                    }
                    return item;
                })
            )*/

            setCurrentLink({
                ...currentLink,
                icon: source
            })

        } else {
            el.classList.remove('active');
        }
    }

    //console.log(userLinks);

    return (
        <div className="icon_row">
            <div className="icon_box">
                <div className="my_row top">
                    <input type="text"/>
                    <div className="uploader">
                        <label htmlFor="header_file_upload" className="custom text-uppercase button blue">
                            Custom Icon
                        </label>
                        {/* <input id="header_file_upload" type="file"
                                   onChange={onSelectFile}
                            />*/}
                        <input id="header_file_upload" type="file" className="custom"/>
                    </div>
                </div>
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

export default IconList;
