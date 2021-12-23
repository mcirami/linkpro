import {IoIosLock} from 'react-icons/io';
import React, {useContext, useEffect, useState} from 'react';
import {PageContext} from '../App';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import Switch from "react-switch";
import EventBus from '../../../../Utils/Bus';
import {passwordProtect, passwordStatus} from '../../../../Services/PageRequests';

const PasswordProtect = ({ userSub, setShowUpgradePopup, setOptionText }) => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    const [isEditing, setIsEditing] = useState(false);
    const [checked, setChecked] = useState(pageSettings['is_protected']);
    const [password, setPassword] = useState(pageSettings['password']);
    const [enableSubmit, setEnableSubmit] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        if(password && password.length > 3) {

            const packets = {
                is_protected: true,
                password: password
            };

            passwordProtect(packets, pageSettings["id"])
            .then((data) => {
                if (data.success) {
                    setPageSettings({
                        ...pageSettings,
                        password: password,
                        is_protected: true,
                    })
                    setIsEditing(false);
                    setChecked(true);
                }
            })

        } else {
            EventBus.dispatch("error", {message: "Password must be at least 4 characters"});
        }
    }

    const handleCheckedChange = (type) => {

        let passProtected;

        if (type === "enable") {
            passProtected = true;
        } else if (type === "disable") {
            passProtected = false;
        } else {
            passProtected = !checked;
            type = null;
        }

        if(password && password.length > 3) {

            setChecked(passProtected);

            const packets = {
                is_protected: passProtected,
                password: password
            };

            passwordStatus(packets, pageSettings["id"], type, checked)
            .then((data) => {

                if (data.success) {

                    if (type === null) {
                        setIsEditing(false);
                    }
                    setPageSettings({
                        ...pageSettings,
                        is_protected: passProtected,
                    })

                }
            })
        }

    }

    const handleClick = (e) => {
        e.preventDefault();

        if (userSub) {
            const {braintree_status, ends_at, name} = {...userSub};
            const currentDate = new Date().valueOf();
            const endsAt = new Date(ends_at).valueOf();

            if (( (braintree_status === 'active' || braintree_status === 'pending') && (name === "premier" || name === "custom") ) || endsAt > currentDate && (name === "premier" || name === "custom") ) {
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

    const handleCharMin = (e) => {
        let value = e.target.value;

        if (value.length > 3) {
            setEnableSubmit(true);
            handleCheckedChange("enable");
            setChecked(true);
        } else {
            setEnableSubmit(false);
            handleCheckedChange("disable");
        }

        setPassword(value);
    }

    useEffect(() => {

        if (password && password.length > 3) {
            setEnableSubmit(true);
        }

    }, [])

    return (
        <div className={isEditing ? "row page_settings mb-0" : "row page_settings" } key={ pageSettings['id'] }>
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
                                           onChange={(e) => handleCharMin(e) }
                                           onKeyPress={ event => {
                                                   if(event.key === 'Enter') {
                                                       handleSubmit(event);
                                                   }
                                               }
                                           }
                                           onBlur={(e) => handleSubmit(e)}
                                    />
                                    {enableSubmit === true ?
                                        <a className="submit_circle" href="#"
                                           onClick={(e) => handleSubmit(e)}>
                                            <FiThumbsUp/>
                                        </a>
                                        :
                                        <span className="cancel_icon">
                                           <FiThumbsDown />
                                       </span>
                                    }
                                    {!enableSubmit &&
                                        <p className="char_max red">Your password must be at least 4 characters</p>
                                    }
                                </div>
                            </form>
                        </div>
                        :
                    <div className="column_wrap">
                        <a className="column_content" href="#" onClick={(e) => handleClick(e) }>
                            <h3>{checked ? "Link is Password Protected" : "Password Protect Your Link?"}</h3>
                            <span className={checked ? "lock_icon" : "lock_icon disabled"}>
                                <IoIosLock/>
                                <div className="hover_text password"><p>Edit Password</p></div>
                            </span>
                        </a>
                    </div>
                }

            </div>
        </div>
    )
}

export default PasswordProtect;
