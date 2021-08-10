import {IoIosLock} from 'react-icons/io';
import React, {useContext, useState} from 'react';
import {PageContext} from '../App';
import {MdCancel, MdCheckCircle } from 'react-icons/md';
import axios from 'axios';
import EventBus from '../../Utils/Bus';

const PasswordProtect = () => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    const [isEditing, setIsEditing] = useState(false);
    const [checked, setChecked] = useState(pageSettings['is_protected']);
    const [password, setPassword] = useState(pageSettings['password']);

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            is_protected: checked,
            password: password
        };

        axios.post('/dashboard/page/update-password/' + pageSettings['id'], packets)
        .then(
            (response) => {
                //console.log(JSON.stringify(response.data))
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });
                setPageSettings({
                    ...pageSettings,
                    password: password,
                })
                //setIsEditing(false)
            }
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);

        })
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
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
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });
                setPageSettings({
                    ...pageSettings,
                    is_protected: !checked,
                })
                //setIsEditing(false)
            }
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);

        })
    }

    return (
        <div className="row page_settings" key={ pageSettings['id'] }>
            <div className="col-12">

                { isEditing ?
                        <div className="edit_form password">
                            <form onSubmit={handleSubmit}>
                                <div className="input">
                                    <input id="password"
                                           type="text"
                                           name="password"
                                           defaultValue={password || "" }
                                           placeholder="Enter Password"
                                           onChange={(e) => handlePasswordChange(e) }
                                           onKeyPress={ event => {
                                                   if(event.key === 'Enter') {
                                                       handleSubmit(event);
                                                   }
                                               }
                                           }
                                    />
                                    {/*<button className="button settings" type="submit">
                                        <MdCheckCircle/>
                                    </button>*/}
                                </div>
                                <div className="checkbox">
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
                                </div>
                            </form>
                        </div>
                        :
                    <div className="column_wrap">
                        <div className="column_content">
                            <h3>Password Protect</h3>
                            <a className="lock_icon" href="#" onClick={(e) => { e.preventDefault(); setIsEditing(true)} }><IoIosLock/></a>
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default PasswordProtect;
