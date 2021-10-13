import {IoIosLock} from 'react-icons/io';
import React, {useContext, useState} from 'react';
import {PageContext} from '../App';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import Switch from "react-switch";
import axios from 'axios';
import EventBus from '../../Utils/Bus';

const PasswordProtect = ({ userSub, setShowUpgradePopup, setOptionText }) => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    const [isEditing, setIsEditing] = useState(false);
    const [checked, setChecked] = useState(pageSettings['is_protected']);
    const [password, setPassword] = useState(pageSettings['password']);

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            is_protected: true,
            password: password
        };

        axios.post('/dashboard/page/update-password/' + pageSettings['id'], packets)
        .then(
            (response) => {
                //console.log(JSON.stringify(response.data))
                const returnMessage = JSON.stringify(response.data.message);
                //const message = returnMessage.toString();
                EventBus.dispatch("success", { message: returnMessage });
                setPageSettings({
                    ...pageSettings,
                    password: password,
                })
                setPageSettings({
                    ...pageSettings,
                    is_protected: true,
                })
                setIsEditing(false);
                setChecked(true);
            }
        ).catch(error => {
            if ( error.response ) {
                EventBus.dispatch("error", { message: error.response.data.errors.is_protected[0] });
            } else {
                console.log("ERROR:: ", error);
            }
        })
    }

    const handleCheckedChange = (e) => {

        setChecked(!checked);

        const packets = {
            is_protected: !checked,
            password: password
        };

        axios.post('/dashboard/page/update-password/' + pageSettings['id'], packets)
        .then(
            (response) => {
                //console.log(JSON.stringify(response.data))
                //const returnMessage = JSON.stringify(response.data.message);
                let returnMessage;

                if(!checked) {
                    returnMessage = "Page Password Enabled";
                } else {
                    returnMessage = "Page Password Disabled";
                    setIsEditing(false);
                }
                EventBus.dispatch("success", { message: returnMessage });
                setPageSettings({
                    ...pageSettings,
                    is_protected: !checked,
                })

                setIsEditing(false);

            }
        ).catch(error => {
            //console.log("ERROR:: ", error.response.data);
            if (error.response) {
                EventBus.dispatch("error", { message: error.response.data.errors.is_protected[0] });
            } else {
                console.log("ERROR:: ", error);
            }
        })
    }

    const handleClick = (e) => {
        e.preventDefault();

        if (userSub) {
            const {braintree_status, ends_at, name} = {...userSub};
            const currentDate = new Date().valueOf();
            const endsAt = new Date(ends_at).valueOf();

            if ((braintree_status === 'active' && name === "corporate") || endsAt > currentDate && name === "corporate") {
                setIsEditing(true);
            } else if (name === "pro" || endsAt < currentDate) {
                showPopup();
            }

        } else {
            showPopup();
        }
    }

    const showPopup = () => {
        const popup = document.querySelector('#upgrade_popup');

        setShowUpgradePopup(true);
        popup.classList.add('open');
        setOptionText("password protect your page");

        setTimeout(() => {
            document.querySelector('#upgrade_popup .close_popup').addEventListener('click', function(e) {
                e.preventDefault();
                setShowUpgradePopup(false);
                popup.classList.remove('open');
            });
        }, 500);
    }

    return (
        <div className="row page_settings" key={ pageSettings['id'] }>
            <div className="col-12">

                { isEditing ?
                        <div className="edit_form password">
                            <form onSubmit={handleSubmit}>
                                <div className="checkbox">
                                    <Switch
                                        id="password_enable"
                                        name="is_protected"
                                        height={20}
                                        width={45}
                                        checked={Boolean(checked)}
                                        onColor="#424fcf"
                                        onChange={handleCheckedChange}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                    />
                                </div>
                                <div className="input">
                                    <input id="password"
                                           type="text"
                                           name="password"
                                           defaultValue={password || "" }
                                           placeholder="Enter Password"
                                           onChange={(e) => setPassword(e.target.value) }
                                           onKeyPress={ event => {
                                                   if(event.key === 'Enter') {
                                                       handleSubmit(event);
                                                   }
                                               }
                                           }
                                    />
                                    <a className="submit_circle" href="#"
                                       onClick={(e) => handleSubmit(e)}>
                                        <FiThumbsUp/>
                                    </a>
                                </div>
                                {/*<div className="checkbox">
                                    <label htmlFor="password_enable">
                                        <input
                                            id="password_enable"
                                            name="is_protected"
                                            type="checkbox"
                                            checked={checked}
                                            onChange={handleCheckedChange}
                                        />
                                        <span className="checkmark">

                                        </span>
                                    </label>
                                </div>*/}
                            </form>
                        </div>
                        :
                    <div className="column_wrap">
                        <a className="column_content" href="#" onClick={(e) => handleClick(e) }>
                            <h3>{checked ? "Link is Password Protected" : "Password Protect Your Link?"}</h3>
                            <span className={checked ? "lock_icon" : "lock_icon disabled"}>
                                <IoIosLock/>
                            </span>
                        </a>
                    </div>
                }

            </div>
        </div>
    )
}

export default PasswordProtect;
