import React from 'react';
import {checkSubStatus} from '../../../../Services/UserService';

const FolderLinks = ({icons}) => {

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
