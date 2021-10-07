import React, {useContext, useState, useEffect} from 'react';
//import {LinksContext} from './App';

//const iconPaths = user.icons;
const customIcons = user.userIcons;

const IconList = ({currentLink, setCurrentLink, iconArray, radioValue}) => {

    //const  { userLinks, setUserLinks } = useContext(LinksContext);

    /*let iconArray = [];

    iconPaths.map((iconPath) => {
        const end = iconPath.lastIndexOf("/");
        const newPath = iconPath.slice(end);
        const newArray = newPath.split(".")
        const iconName = newArray[0].replace("/", "");
        const tmp = {"name": iconName, "path" : iconPath}
        iconArray.push(tmp);
    });*/

    //const [customIcon, setCustomIcon] = useState(null);
    //const [preview, setPreview] = useState();
    //let [icons, setIcons] = useState(iconArray);

    /*const [input, setInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setInput(e.target.value);
    }

    if (input.length > 0 ) {
        iconArray = iconArray.filter((i) => {
            return i.name.match(input);
        });
    }*/

 /*   useEffect(() => {
        if (!customIcon) {
            //setPreview(undefined)
            return
        }
        //setPageHeader(selectedFile["name"]);
        const objectUrl = URL.createObjectURL(customIcon)
        //setPreview(objectUrl)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [customIcon])
*/
    const selectIcon = (e, source) => {
        const el = e.target;

        if(!el.classList.contains('active')) {
            $('.icon_image').removeClass('active');
            el.classList.add('active');

            const name = el.dataset.name;

            setCurrentLink({
                ...currentLink,
                name: name,
                icon: source
            })

        } else {
            el.classList.remove('active');
        }
    }

    /*const selectCustomIcon = (e) => {

        let files = e.target.files || e.dataTransfer.files;

        if (!files.length) {
            return;
        }

        const file = files[0];

        setCustomIcon(file);
        createImage(file);
    }

    const createImage = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            setCurrentLink({
                ...currentLink,
                icon: e.target.result
            })
        };
        reader.readAsDataURL(file);

    }
*/
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
                    customIcons &&
                    customIcons.map((iconPath, index) => {
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
                                    alt=""/>
                            </div>
                        )
                    })

            }
        </div>


    );
}

export default IconList;
