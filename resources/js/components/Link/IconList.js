import React, {useState} from 'react';
//import {LinksContext} from './App';

const IconList = ({currentLink, setCurrentLink, iconArray, radioValue, setCharactersLeft, customIconArray}) => {


    const selectIcon = (e, source) => {
        const el = e.target;

        if(!el.classList.contains('active')) {
            $('.icon_image').removeClass('active');
            el.classList.add('active');

            let name;
            if(el.dataset.name) {
                name = el.dataset.name;
                setCharactersLeft(13 - name.length);
            } else {
                name = currentLink.name;
            }

            setCurrentLink({
                ...currentLink,
                name: name,
                icon: source
            })

        } else {
            el.classList.remove('active');
        }
    }

    return (

        <div className="icons_wrap my_row">
            {/*{preview ?
                <div className="custom_icons">
                    <img className="img-fluid icon_image active" src={preview} name="custom_icon" alt="" onClick={(e) => {e.preventDefault(); selectIcon(e, customIcon)} } />
                </div>
                : ""
            }*/}

            {
                radioValue === "custom" ?
                    customIconArray &&
                    customIconArray.map((iconPath, index) => {
                        const newPath = iconPath.replace("public",
                            "/storage");

                        return (
                            <div key={index} className="icon_col">
                                <img alt="" className="img-fluid icon_image" src={newPath} onClick={(e) => {
                                    e.preventDefault();
                                    selectIcon(e, newPath)
                                }}/>
                            </div>
                        )

                    })

                :

                    iconArray.map((icon, index) => {
                        /*let end = iconPath.search("/images");
                        let newPath = iconPath.slice(end);*/
                        return (
                            <div key={index} className="icon_col">
                                <img
                                    className="img-fluid icon_image"
                                    src={'/' + icon.path} onClick={(e) => {
                                                e.preventDefault();
                                                selectIcon(e, "/" + icon.path)
                                            }}
                                    data-name={icon.name}
                                    alt=""
                                />
                                <div className="hover_text icon_text">
                                    <p>
                                        {icon.name}
                                    </p>
                                </div>
                            </div>
                        )
                    })

            }
        </div>


    );
}

export default IconList;
