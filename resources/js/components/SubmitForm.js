import React, {useContext, useState } from 'react';
import IconList from "./IconList";
import axios from "axios";
import { LinksContext, PageContext } from './App';

const SubmitForm = ({
    editID,
    setEditID,
    setUserLinks,
    userLinks
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
            page_id : pageSettings["id"]
        };

        if (editID == "new") {
            axios.post('/dashboard/links/new', packets).then(
                response => {
                    console.log(JSON.stringify(response.data));
                    const link_id = JSON.stringify(response.data.link_id);
                    const newElement = {
                        id: link_id,
                        name: currentLink.name,
                        url: currentLink.url,
                        icon: currentLink.icon,
                        page_id: pageSettings["id"]
                    };
                    setUserLinks(userLinks.concat(newElement));
                })
            .catch(error => {
                console.log("ERROR:: ", error.response.data);

            });


        } else {
            axios.post('/dashboard/links/update/' + editID, packets).then(
                response => alert(JSON.stringify(response.data)),
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
                ),
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
                        {/*<img
                            id="current_icon"
                            src={currentLink[0].icon}
                            name="link_icon"
                            alt=""
                        />*/}

                        <IconList currentLink={currentLink} setCurrentLink={setCurrentLink}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <input
                            name="name"
                            type="text"
                            defaultValue={editID !== "new" ? currentLink.name : ""}
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
                            defaultValue={editID !== "new" ? currentLink.url : ""}
                            placeholder="Link Url"
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
            {/*<form>
                <div className="my_row">
                    <input
                        type="text"
                        defaultValue={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={(event) => {
                            if (event.key === "Enter") {
                                handleSubmit(event, id);
                            }
                        }}
                    />
                </div>
                <div className="my_row">
                    <input
                        type="text"
                        defaultValue={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyPress={(event) => {
                            if (event.key === "Enter") {
                                handleSubmit(event, id);
                            }
                        }}
                    />
                </div>
            </form>*/}
        </div>
    );
};

export default SubmitForm;
