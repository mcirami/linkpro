import FolderLinks from './FolderLinks';
import React from 'react';

const Folder = ({
                    colClasses,
                    mainIndex,
                    links,
                    setRow,
                    value,
                    setValue,
                    dataRow
                }) => {

    const folderClick = (e, index) => {
        e.preventDefault();

        const clickedDiv = e.currentTarget.parentNode;

        if (clickedDiv.classList.contains('open')) {
            setRow(null);
            setValue(null);
        } else {
            setRow(clickedDiv.firstChild.dataset.row);
            setValue(index);
        }
    }

    return (

        <div className={ ` ${colClasses} ${mainIndex == value ? " open" : "" } `}>
            <a className="inner_icon_wrap" href="#" data-row={ dataRow } onClick={(e) => {folderClick(e, mainIndex)} }>
                <img className="bg_image" src={ Vapor.asset('images/blank-folder-square.jpg') } alt=""/>
                <div className="folder_icons preview">
                    {links.slice(0, 9).map(( innerLinkIcons, index ) => {
                        return (
                            <FolderLinks key={index} icons={innerLinkIcons} />
                        )
                    })}

                </div>
            </a>
            <p>
                {name && name.length >
                11 ?
                    name.substring(0,
                        11) + "..."
                    :
                    name || "Link Name"
                }
            </p>
        </div>
    )
}

export default Folder;
