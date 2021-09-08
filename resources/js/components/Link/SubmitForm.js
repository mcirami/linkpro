import React, {useContext, useState } from 'react';
import IconList from "./IconList";
import axios from "axios";
import { LinksContext, PageContext } from '../App';
import EventBus from '../../Utils/Bus';

const SubmitForm = ({
    editID,
    setEditID,
    setUserLinks,
    userLinks,
    originalArray,
    setOriginalArray
}) => {

    //const  { userLinks, setUserLinks } = useContext(LinksContext);
    const  { pageSettings, setPageSettings } = useContext(PageContext);

    const [ currentLink, setCurrentLink ] = useState(
        userLinks.find(function(e) {
            return e.id === editID
        }) || null );

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            name: currentLink.name,
            url: currentLink.url,
            icon: currentLink.icon,
            page_id : pageSettings["id"],
        };

        if (editID.toString().includes("new")) {
            axios.post('/dashboard/links/new', packets)
            .then(
                (response) => {
                    //console.log(JSON.stringify(response.data));
                    const returnMessage = JSON.stringify(response.data.message);
                    EventBus.dispatch("success", { message: returnMessage });
                    const link_id = JSON.stringify(response.data.link_id);
                    let count = 0;
                    setUserLinks(
                        userLinks.map((item) => {
                            if (!item.id) {
                                count++;
                                if (count === 1) {
                                    return {
                                        id: link_id,
                                        name: currentLink.name,
                                        url: currentLink.url,
                                        icon: currentLink.icon,
                                        active_status: 1,
                                        page_id: pageSettings["id"]
                                    }
                                }
                            }
                            return item;
                        })
                    )
                    setEditID(null);
                })
            .catch(error => {
                console.log("ERROR:: ", error.response.data);

            });


        } else {
            axios.post('/dashboard/links/update/' + editID, packets)
            .then(
                (response) => {
                    const returnMessage = JSON.stringify(response.data.message);
                    EventBus.dispatch("success", {message: returnMessage});
                    setUserLinks(
                        userLinks.map((item) => {
                            if (item.id === editID) {
                                return {
                                    ...item,
                                    name: currentLink.name,
                                    url: currentLink.url,
                                    icon: currentLink.icon
                                }
                            }
                            return item;
                        })
                    )
                    setOriginalArray(
                        originalArray.map((item) => {
                            if (item.id === editID) {
                                return {
                                    ...item,
                                    name: currentLink.name,
                                    url: currentLink.url,
                                    icon: currentLink.icon
                                }
                            }
                            return item;
                        })
                    )
                    setEditID(null)
                }
            ).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });
        }
    };

    return (
        <div className="edit_form popup" key={editID}>
            <form onSubmit={handleSubmit} className="link_form">
                <div className="row">
                    <div className="col-12">
                        <IconList currentLink={currentLink} setCurrentLink={setCurrentLink}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <input
                            name="name"
                            type="text"
                            defaultValue={ editID.toString().includes("new") ? "" : currentLink.name}
                            placeholder="Link Name"
                            onChange={(e) => setCurrentLink({
                                ...currentLink,
                                name: e.target.value
                            }) }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <input
                            name="url"
                            type="text"
                            defaultValue={editID.toString().includes("new") ? "" : currentLink.url }
                            placeholder="https://linkurl.com"
                            onChange={(e) => setCurrentLink({
                                ...currentLink,
                                url: e.target.value
                            }) }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 button_row">
                        <button className="button red" type="submit">
                            Save
                        </button>
                        <a href="#" onClick={(e) => {e.preventDefault(); setEditID(null); }}>
                            Cancel
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SubmitForm;
