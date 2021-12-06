import {PageContext} from '../App';
import {useContext} from 'react';

const DisablePage = () => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    return (
        <div className="row page_settings">
            <div className="col-12">

            </div>
        </div>
    )
}

export default DisablePage
