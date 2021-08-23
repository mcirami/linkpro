import React, {useContext, useState, useEffect} from 'react';
//import {LinksContext} from './App';

const IconList = ({currentLink, setCurrentLink}) => {
    const iconPaths = user.icons;
    const customIcons = user.userIcons;

    //const  { userLinks, setUserLinks } = useContext(LinksContext);

    const [customIcon, setCustomIcon] = useState(null);
    const [preview, setPreview] = useState();

    useEffect(() => {
        if (!customIcon) {
            setPreview(undefined)
            return
        }
        //setPageHeader(selectedFile["name"]);
        const objectUrl = URL.createObjectURL(customIcon)
        setPreview(objectUrl)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [customIcon])

    const selectIcon = (e, source) => {
        const el = e.target;

        if(!el.classList.contains('active')) {
            $('.icon_image').removeClass('active');
            el.classList.add('active');

            setCurrentLink({
                ...currentLink,
                icon: source
            })

        } else {
            el.classList.remove('active');
        }
    }

    const selectCustomIcon = (e) => {

        let files = e.target.files || e.dataTransfer.files;

        /*if (!e.target.files || e.target.files.length === 0) {
            setCustomIcon(null)
            return
        }*/

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

    return (
        <div className="icon_row">
            <div className="icon_box">
                <div className="my_row top">
                    <input type="text"/>
                    <div className="uploader">
                        <label htmlFor="header_file_upload" className="custom text-uppercase button blue">
                            Custom Icon
                        </label>
                        <input id="header_file_upload" type="file" className="custom" onChange={selectCustomIcon}/>
                    </div>
                </div>
                <div className="icons_wrap my_row">
                    {preview ?
                        <div className="custom_icons">
                            <img className="img-fluid icon_image active" src={preview} name="custom_icon" alt="" onClick={(e) => {e.preventDefault(); selectIcon(e, customIcon)} } />
                        </div>
                        : ""
                    }

                    {customIcons ?
                        customIcons.map((iconPath, index) => {
                            const newPath = iconPath.replace("public",
                                "/storage");
                            return (
                                <div key={index} className="icon_col">
                                    <img className="img-fluid icon_image" src={newPath} onClick={(e) => {
                                        e.preventDefault();
                                        selectIcon(e, newPath)
                                    }}/>
                                </div>
                            )

                        })
                    :
                    ""
                    }

                    {iconPaths.map((iconPath, index) => {
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
