import React, {useState} from 'react';
import Links from './Links';

const Column = ({index, setLinkID, linkItem, currentName, setName, currentUrl, setUrl, currentIcon, setIcon, userLinks, setUserLinks, defaultIconPath, pageID}) => {

    return (
        <>
            <Links
                linkItem={linkItem}
                setLinkID={setLinkID}
                currentName={currentName}
                setName={setName}
                currentUrl={currentUrl}
                setUrl={setUrl}
                currentIcon={currentIcon}
                setIcon={setIcon}
                userLinks={userLinks}
                setUserLinks={setUserLinks}
                defaultIconPath={defaultIconPath}
                pageID={pageID}
            />

        </>
    )
}

export default Column
