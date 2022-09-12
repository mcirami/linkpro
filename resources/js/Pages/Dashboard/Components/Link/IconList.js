import React from 'react';
import {icons} from '../../../../Services/iconObjects';

const IconList = ({currentLink, setCurrentLink, iconArray, radioValue, setCharactersLeft, customIconArray, setInputType}) => {

    const selectIcon = (e, source) => {
        const el = e.target;

        if(!el.classList.contains('active')) {
            $('.icon_image').removeClass('active');
            el.classList.add('active');

            let name;
            if(el.dataset.name) {
                name = el.dataset.name;
                setCharactersLeft(11 - name.length);

                if(name.toLowerCase().includes("mail") || name.toLowerCase().includes("yahoo") || name.toLowerCase().includes("outlook") ) {
                    setInputType("email");
                } else if (name.toLowerCase() === "phone" || name.toLowerCase() === "facetime") {
                    setInputType("phone");
                } else {
                    setInputType("url");
                }

            } else {
                name = currentLink.name;
            }

            let url = "";
            let icon = icons.find(icon => icon.name === name);
            if (icon && icon.prefix) {
                url = icon.prefix;
            }

            setCurrentLink(prevState => ({
                ...prevState,
                name: name,
                icon: source,
                url: url
            }))

        } else {
            el.classList.remove('active');
        }
    }

    return (

        <div className="icons_wrap my_row">
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
                                    src={icon.path} onClick={(e) => {
                                                e.preventDefault();
                                                selectIcon(e, icon.path)
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
