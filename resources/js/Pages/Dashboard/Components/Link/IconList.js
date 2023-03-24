import React, {useCallback, useEffect, useState} from 'react';
import {icons} from '../../../../Services/IconObjects';
import {
    getIcons,
} from '../../../../Services/IconRequests';
import {getIconPaths} from '../../../../Services/ImageService';

const IconList = ({
                      currentLink,
                      setCurrentLink,
                      accordionValue,
                      setCharactersLeft,
                      inputType = null,
                      setInputType = null,
                      integrationType = null,
                      editID,
                      customIconArray = null,
                      setCustomIconArray = null,
                      iconList = null,
                      setIconList = null,
}) => {

    const [isDefaultIcon, setIsDefaultIcon] = useState(false);
    const [authUser, setAuthUser] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const selectIcon = useCallback((e, source) => {
        e.preventDefault();
        const el = e.target;
        const iconType = el.dataset.icontype;

        if(!el.classList.contains('active')) {
            $('.icon_image').removeClass('active');
            el.classList.add('active');

            let name;
            if(el.dataset.name) {
                name = el.dataset.name;
                setCharactersLeft(11 - name.length);

                if( (name.toLowerCase().includes("mail") && !name.toLowerCase().includes("mailchimp") )
                    || name.toLowerCase().includes("yahoo")
                    || name.toLowerCase().includes("outlook") ) {
                    setInputType("email");
                } else if (name.toLowerCase() === "phone" || name.toLowerCase() === "facetime") {
                    setInputType("phone");
                } else {
                    setInputType("url");
                }

            } else {
                name = currentLink.name;
            }

            let url = null;
            if(iconType === "standard") {
                let icon = icons.find(icon => icon.name === name);
                if (icon?.prefix) {
                    url = icon.prefix;
                }
            }

            if(iconType === "affiliate") {
                url = window.location.origin + "/" + el.dataset.creator + "/course/" + el.dataset.slug + "?a=" + authUser + "&o=" + el.dataset.offer;
                setInputType("affiliate")
            }

            setCurrentLink(prevState => ({
                ...prevState,
                name: name,
                icon: source,
                url: url,
                type: "standard"
            }))

        } else {
            el.classList.remove('active');
        }
    });

    /*const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    }

    if (searchInput.length > 0) {
        setIconList (
            iconList.filter((i) => {
                const iconName = i.name.toLowerCase().replace(" ", "");
                const userInput = searchInput.toLowerCase().replace(" ", "");
                return iconName.match(userInput);
            })
        )
    }*/

    useEffect(() => {

        if (accordionValue === "integration" && !editID) {
            setIsDefaultIcon(true)

            if (integrationType === "mailchimp") {
                setCurrentLink(prevState => ({
                    ...prevState,
                    icon: "https://local-lp-user-images.s3.us-east-2.amazonaws.com/icons/Mailchimp.png",
                    type: "mailchimp"
                }))
            }

            if (integrationType === "shopify") {
                setCurrentLink(prevState => ({
                    ...prevState,
                    icon: "https://lp-production-images.s3.us-east-2.amazonaws.com/icons/Shopify.png",
                    type: "shopify"
                }))
            }
        }

        setIsLoading(false);

    },[accordionValue])

    useEffect(() => {

        let url;

        switch(accordionValue) {
            case "affiliate":
                url = '/get-aff-icons';
                break;
            case "custom":
            case "integration":
                url = '/get-custom-icons';
                break;
            case "standard":
                url = '/get-standard-icons'
                break;
            default:
                break;
        }

        getIcons(url).then((data) => {
            if(data.success) {
                if (accordionValue === "standard") {
                    setIconList(getIconPaths(data.iconData));
                } else if (accordionValue === "custom" || accordionValue === "integration") {
                    setCustomIconArray(data.iconData);
                } else {
                    setIconList(data.iconData)
                }
                if (data.authUser) {
                    setAuthUser(data.authUser);
                }

                setIsLoading(false);
            }
        })

    },[accordionValue])

    return (

        <>
            {/*{accordionValue === "standard" &&
                <div className="uploader">
                    <input name="search" type="text" placeholder="Search Icons" onChange={(e) => handleChange(e)} defaultValue={searchInput}/>
                    <div className="my_row info_text file_types text-center mb-2 text-center">
                        <a href="mailto:help@link.pro" className="mx-auto m-0 char_count">Don't See Your Icon? Contact Us!</a>
                    </div>
                </div>
            }*/}

            <div className={`icons_wrap my_row ${accordionValue === "integration" ? "outer integration_icons" : ""}`}>
                {isLoading &&
                    <div id="loading_spinner" className="active">
                        <img src={Vapor.asset('images/spinner.svg')} alt="" />
                    </div>
                }
                {{
                    "custom" :

                        customIconArray ? customIconArray.map((iconPath, index) => {
                            const newPath = iconPath?.replace("public",
                                "/storage");

                            return (
                                <div key={index} className="icon_col">
                                    <img alt=""
                                         className="img-fluid icon_image"
                                         data-icontype={accordionValue}
                                         src={newPath}
                                         onClick={(e) => {
                                             selectIcon(e, newPath)
                                         }}/>
                                </div>
                            )

                        })
                            :
                            <div className="info_message">
                                <p>You don't have any icons to display.</p>
                                <p>Click 'Upload Image' above to add a custom icon.</p>
                            </div>,

                    "integration" :
                    <>
                        <div className="icon_col default_icon">
                            <p>Default Icon</p>
                            <img alt=""
                                 className={`
                                 ${isDefaultIcon ? "active img-fluid icon_image" : "img-fluid icon_image"}`}
                                 src={integrationType === "mailchimp" ? "https://local-lp-user-images.s3.us-east-2.amazonaws.com/icons/Mailchimp.png" : "https://lp-production-images.s3.us-east-2.amazonaws.com/icons/Shopify.png"}
                                 data-icontype="default"
                                 onClick={(e) => {
                                    selectIcon(e, e.target.src)
                                }}/>
                        </div>
                        <div className="custom_icons">
                            <p>Custom Icons</p>
                            <div className="icons_wrap inner">
                                {customIconArray ? customIconArray.map((iconPath, index) => {
                                    const newPath = iconPath.replace("public",
                                        "/storage");

                                    return (
                                        <div key={index} className="icon_col">
                                            <img alt=""
                                                 className="img-fluid icon_image"
                                                 src={newPath}
                                                 data-icontype={accordionValue}
                                                 onClick={(e) => {
                                                     selectIcon(e, newPath)
                                                }}/>
                                        </div>
                                    )
                                })
                                    :
                                    <div className="info_message">
                                        <p>You don't have any icons to display.</p>
                                        <p>Click 'Upload Image' above to add a custom icon.</p>
                                    </div>
                                }
                            </div>
                        </div>
                    </>,

                    "standard" :

                        iconList?.map((icon, index) => {

                            return (
                                <div key={index} className="icon_col">
                                    <img
                                        className="img-fluid icon_image"
                                        src={icon.path}
                                        onClick={(e) => {
                                            selectIcon(e, icon.path)
                                        }}
                                        data-name={icon.name}
                                        data-icontype={accordionValue}
                                        alt=""
                                    />
                                    <div className="hover_text icon_text">
                                        <p>
                                            {icon.name}
                                        </p>
                                    </div>
                                </div>
                            )
                        }),

                    "affiliate" :
                        iconList?.map((icon, index) => {

                            return (
                                <div key={index} className="icon_col">
                                    <img
                                        className="img-fluid icon_image"
                                        src={icon.path}
                                        onClick={(e) => {
                                            selectIcon(e, icon.path)
                                        }}
                                        data-name={icon.name}
                                        data-creator={icon.creator}
                                        data-slug={icon.slug}
                                        data-offer={icon.offer_id}
                                        data-icontype={accordionValue}
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
                }[accordionValue]}
            </div>

        </>


    );
}

export default IconList;
