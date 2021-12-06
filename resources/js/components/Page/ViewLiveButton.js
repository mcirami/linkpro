import React, {useContext} from 'react';
import {PageContext} from '../App';

const ViewLiveButton = () => {

    const host = window.location.origin;
    const { pageSettings, setPageSettings } = useContext(PageContext);

    return(
        <div className="view_live_link">
            <a className="button green" target="_blank" href={ host + '/' + pageSettings['name'] }>Finished</a>
        </div>
    )
}

export default ViewLiveButton
