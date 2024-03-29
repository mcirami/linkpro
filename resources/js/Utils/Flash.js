import React, {useEffect, useContext} from 'react';
import {MdCheckCircle, MdCancel} from 'react-icons/md';
import {UserLinksContext} from '../Pages/Dashboard/App';

export const Flash = ({msg, type, removeFlash, pageSettings}) => {

    const { userLinks } = useContext(UserLinksContext);

    useEffect(() => {

        const timeout = setTimeout(() => {
            removeFlash();
        }, 4000);

        return () => clearTimeout(timeout);
    }, [userLinks, pageSettings])

    return (

        <div className="message_wrap">
            <div className="display_message alert">
                <div className="icon_wrap">
                    {type === "success" ?
                        <MdCheckCircle/>
                        :
                        <div className="error">
                            <MdCancel/>
                        </div>
                    }
                </div>
                <p>{ msg }</p>
            </div>
        </div>


    )
}

