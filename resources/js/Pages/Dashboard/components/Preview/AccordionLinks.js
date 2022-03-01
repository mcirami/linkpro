import React from 'react';
import {checkSubStatus} from '../../../../Services/UserService';

const AccordionLinks = ({icons}) => {

    const {id, name, email, phone, icon, url, active_status} = icons
    let source;
    if (email) {
        source = "mailto:" + email;
    } else if (phone) {
        source = "tel:" + phone;
    } else {
        source = url;
    }

    const displayIcon = checkSubStatus(icon);
    return (
        <div className="icon_col">
            {active_status ?
                <>
                    <a href={source} target="_blank">
                        <img src={displayIcon} alt={name} title={name}/>
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
                </>
                :
                ""
            }
        </div>
    )
}

export default AccordionLinks;
