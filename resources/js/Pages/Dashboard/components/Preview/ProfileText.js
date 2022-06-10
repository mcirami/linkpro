import React, {useContext} from 'react';
import {PageContext} from '../../App';

const ProfileText = () => {

    const {pageSettings, setPageSettings} = useContext(PageContext);

    return (
        <div className="profile_text">
            <h2>{pageSettings["title"] || "Add Title"}</h2>
            <p>{pageSettings["bio"] ||
            "Add Bio or Slogan"}</p>
        </div>
    )
}

export default ProfileText;