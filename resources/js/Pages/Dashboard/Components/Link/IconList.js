import React, {useEffect, useState} from 'react';
import {icons} from '../../../../Services/IconObjects';

const IconList = ({
                      currentLink,
                      setCurrentLink,
                      iconArray,
                      radioValue,
                      setCharactersLeft,
                      customIconArray,
                      setInputType,
                      formType
}) => {

    const [isDefaultIcon, setIsDefaultIcon] = useState(false);


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

    useEffect(() => {

        if (formType === "new" && radioValue === "integration") {
            setIsDefaultIcon(true)
        }

    },[radioValue])

    console.log(isDefaultIcon);

    return (

        <>
            {{
                "custom" :

                    <div className="icons_wrap my_row">
                        {customIconArray?.map((iconPath, index) => {
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

                        })}
                    </div>,

                "integration" :

                <div className="my_row icons_wrap outer">

                    <div className="icon_col default_icon">
                        <img alt="" className={`${isDefaultIcon ? "active img-fluid icon_image" : "img-fluid icon_image"}`} src="https://local-lp-user-images.s3.us-east-2.amazonaws.com/icons/Mailchimp.png" onClick={(e) => {
                            e.preventDefault();
                            selectIcon(e, "https://local-lp-user-images.s3.us-east-2.amazonaws.com/icons/Mailchimp.png")
                        }}/>
                    </div>
                    <div className="icons_wrap inner">
                        {customIconArray?.map((iconPath, index) => {
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
                        })}
                    </div>
                </div>,

                "standard" :

                <div className="icons_wrap my_row">
                    {iconArray.map((icon, index) => {

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
                    })}
                </div>
            }[radioValue]}
        </>


    );
}

export default IconList;
