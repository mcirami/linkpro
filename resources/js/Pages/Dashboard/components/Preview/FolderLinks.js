import React from 'react';

const FolderLinks = ({icons, checkSubStatus}) => {

    const {id, name, icon, active_status} = icons
    const displayIcon = checkSubStatus(icon);

    return (

        <div className="image_col">
            {active_status ?
                <img src={displayIcon} alt={name} title={name}/>
                :
                ""
            }
        </div>
    )
}

export default FolderLinks;
