import React, {useContext, useState} from 'react';
import { MdEdit } from "react-icons/md";
import Switch from "react-switch";
//import {LinksContext, PageContext} from '../App';
import EventBus from '../../Utils/Bus';

const Links = ({
                   userLinks,
                   setUserLinks,
                   setEditID,

               }) => {

    //const [switchStatus, setSwitchStatus] = useState(active_status);
    //const  { userLinks, setUserLinks } = useContext(LinksContext);


    const handleChange = (id, active_status) => {
        const newStatus = !active_status;

        const packets = {
            active_status: newStatus,
        };

        axios
        .post("/dashboard/links/status/" + id, packets)
        .then(
            (response) => {
                //console.log(JSON.stringify(response.data))
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });
                setUserLinks(
                    userLinks.map((item) => {
                        if (item.id === id) {
                            return {
                                ...item,
                                active_status: newStatus,
                            };
                        }
                        return item;
                    })
                )
            }
        )
        .catch((error) => {
            console.log("ERROR:: ", error.response.data);
        });
    };
    return (
        <>
            {userLinks.map((item, index) => {
                let {id, name, icon, active_status} = item;

                const key = id || "new_" + index;

                return (
                    <div key={name} className="icon_col" id={name} data-name={name}>
                        <div className="column_content">
                            <button className="edit_icon" onClick={(e) => { setEditID(key) }} >
                                <MdEdit />
                            </button>
                            <div className="icon_wrap">
                                <img src={ icon || '/images/icon-placeholder.png' } />
                            </div>
                            <div className="my_row">
                                <div className="switch_wrap">
                                    <Switch
                                        onChange={(e) => handleChange(id, active_status)}
                                        disabled={!id}
                                        height={20}
                                        checked={Boolean(active_status)}
                                        onColor="#424fcf"
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    );
};

export default Links;
