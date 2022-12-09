import React, {useCallback, useEffect, useState} from 'react';
import {icons} from '../../../../Services/IconObjects';

const IconList = ({
                      currentLink,
                      setCurrentLink,
                      iconArray,
                      radioValue,
                      setCharactersLeft,
                      customIconArray,
                      inputType,
                      setInputType,
                      editID
}) => {

    const [isDefaultIcon, setIsDefaultIcon] = useState(false);
    const selectIcon = useCallback((e, source) => {
        e.preventDefault();
        const el = e.target;

        if(!el.classList.contains('active')) {
            $('.icon_image').removeClass('active');
            el.classList.add('active');

            let name;
            if(el.dataset.name) {
                name = el.dataset.name;
                setCharactersLeft(11 - name.length);

                if((name.toLowerCase().includes("mail") && !name.toLowerCase().includes("mailchimp") )|| name.toLowerCase().includes("yahoo") || name.toLowerCase().includes("outlook") ) {
                    setInputType("email");
                } else if (name.toLowerCase() === "phone" || name.toLowerCase() === "facetime") {
                    setInputType("phone");
                } else {
                    setInputType("url");
                }

            } else {
                name = currentLink.name;
            }

            let urlPrefix = "";
            let icon = icons.find(icon => icon.name === name);
            if (icon?.prefix) {
                urlPrefix = icon.prefix;
            }

            setCurrentLink(prevState => ({
                ...prevState,
                name: name,
                icon: source,
                url: urlPrefix,
                type: "standard"
            }))

        } else {
            el.classList.remove('active');
        }
    });

    useEffect(() => {

        if (radioValue === "integration" && !editID) {
            setIsDefaultIcon(true)

            if (inputType === "mailchimp") {
                setCurrentLink(prevState => ({
                    ...prevState,
                    icon: "https://local-lp-user-images.s3.us-east-2.amazonaws.com/icons/Mailchimp.png",
                    type: "mailchimp"
                }))
            }

            if (inputType === "shopify") {
                setCurrentLink(prevState => ({
                    ...prevState,
                    icon: "https://lp-production-images.s3.us-east-2.amazonaws.com/icons/Shopify.png",
                    type: "shopify"
                }))
            }
        }

        if (editID) {

        }

    },[radioValue])

    return (

        <>
            {{
                "custom" :

                    <div className="icons_wrap my_row">
                        {customIconArray?.map((iconPath, index) => {
                            const newPath = iconPath?.replace("public",
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

                <div className="my_row icons_wrap outer integration_icons">

                    <div className="icon_col default_icon">
                        <p>Default Icon</p>
                        <img alt=""
                             className={`
                             ${isDefaultIcon ? "active img-fluid icon_image" : "img-fluid icon_image"}`}
                             src={inputType === "mailchimp" ? "https://local-lp-user-images.s3.us-east-2.amazonaws.com/icons/Mailchimp.png" : "https://lp-production-images.s3.us-east-2.amazonaws.com/icons/Shopify.png"}
                             onClick={(e) => {
                                selectIcon(e, e.target.src)
                            }}/>
                    </div>
                    <div className="custom_icons">
                        <p>Custom Icons</p>
                        <div className="icons_wrap inner">
                            {customIconArray?.map((iconPath, index) => {
                                const newPath = iconPath.replace("public",
                                    "/storage");

                                return (
                                    <div key={index} className="icon_col">
                                        <img alt=""
                                             className="img-fluid icon_image"
                                             src={newPath}
                                             onClick={(e) => {
                                                 selectIcon(e, newPath)
                                            }}/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>,

                "standard" :

                <div className="icons_wrap my_row">
                    {iconArray.map((icon, index) => {

                        return (
                            <div key={index} className="icon_col">
                                <img
                                    className="img-fluid icon_image"
                                    src={icon.path}
                                    onClick={(e) => {
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
