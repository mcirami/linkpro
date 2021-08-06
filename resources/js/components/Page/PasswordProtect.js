import {IoIosLock} from 'react-icons/io';
import React, {useContext} from 'react';
import {PageContext} from '../App';

const PasswordProtect = () => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    return (
        <div className="row page_settings">
            <div className="col-12">
                <div className="column_wrap">
                    <div className="column_content">
                        <h3>Password Protect</h3>
                        <a className="lock_icon" href="#"><IoIosLock/></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PasswordProtect;
