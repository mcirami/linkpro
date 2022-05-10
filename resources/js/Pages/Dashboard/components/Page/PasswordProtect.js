import {IoIosLock} from 'react-icons/io';
import React, {useContext, useEffect, useState, useRef} from 'react';
import {PageContext} from '../../App';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import {BiHelpCircle} from 'react-icons/bi';
import Switch from "react-switch";
import EventBus from '../../../../Utils/Bus';
import {
    passwordProtect,
    passwordStatus,
    toolTipClick,
} from '../../../../Services/PageRequests';
import { Element } from  'react-scroll';

const PasswordProtect = ({
                             userSub,
                             subStatus,
                             setShowUpgradePopup,
                             setOptionText,
                             infoIndex,
                             setInfoIndex
}) => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    const [isEditing, setIsEditing] = useState(false);
    const [checked, setChecked] = useState(pageSettings['is_protected']);
    const [password, setPassword] = useState(pageSettings['password']);
    const [enableSubmit, setEnableSubmit] = useState();

    const infoDiv = useRef();

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

        const {name} = {...userSub};

        if (( subStatus && (name === "premier" || name === "custom") ) ) {
            setIsEditing(true);
        } else {
            showPopup();
        }
    }

    const showPopup = () => {

        setShowUpgradePopup(true);
        setOptionText("password protect your page");

        setTimeout(() => {
            document.querySelector('#upgrade_popup .close_popup').addEventListener('click', function(e) {
                e.preventDefault();
                setShowUpgradePopup(false);
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
        <div className={isEditing ? "my_row page_settings mb-0" : "my_row page_settings" } key={ pageSettings['id'] }>

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
                                           onKeyDown={ event => {
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
                <div className="tooltip_icon">
                    <div onClick={() => toolTipClick(1, infoIndex, setInfoIndex, infoDiv)} >
                        <BiHelpCircle />
                    </div>

                    <Element name="infoText1" className={`hover_text help password ${infoIndex === 1 ? " open" : "" }` } >
                        <div ref={infoDiv}>
                            <p>This option allows PRO and PREMIER users to restrict access to their Page/s for those with the access code. Selecting this option means that only people with an access code can view your LinkPro Page. The access code is required to have a minimum of 4 alpha-numeric characters/symbols.</p>
                            <h5>Pro Tip!</h5>
                            <p>Password protecting a page is useful for promotional offers, exclusive content, and companies with internal information accessible to employees and not the general public.</p>
                        </div>
                    </Element>
                </div>

        </div>
    )
}

export default PasswordProtect;
