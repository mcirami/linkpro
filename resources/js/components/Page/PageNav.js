import React, {useContext, useState} from 'react';
import axios from 'axios';
import {MdAddCircleOutline} from 'react-icons/md';
import {GiThumbDown, GiThumbUp} from 'react-icons/Gi';
import EventBus from '../../Utils/Bus';
import {PageContext} from '../App';

let pageNames = user.pageNames;

const PageNav = ({ allUserPages, setAllUserPages }) => {

    //const [pages, setPages] = useState(userPages);
    const { pageSettings, setPageSettings } = useContext(PageContext);

    const [isEditing, setIsEditing] = useState(false);
    const [newPageName, setNewPageName] = useState(null);
    const [available, setAvailability] = useState(false);


    const pageCount = allUserPages.length;

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            name: newPageName,
        };

        axios.post('/dashboard/page/new', packets).then(
            (response) => {
                //console.log(JSON.stringify(response.data));

                const page_id = JSON.stringify(response.data.page_id);
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });

                const newElement = {
                    id: page_id,
                    name: newPageName,
                };
                setAllUserPages(allUserPages.concat(newElement));
                setIsEditing(false);

            },

        ).catch(error => {
            console.log("ERROR:: ", error.response.data);

        });
    };

    const checkPageName = (e) => {
        let value = e.target.value.toLowerCase().replace(/\s/g, '-');
        const match = pageNames.indexOf(value);

        if (match < 0 && value !== "") {
            setAvailability(true);
        } else {
            setAvailability(false);
        }

        setNewPageName(value)
    }

    const pageList = allUserPages.filter(element => element.id !== pageSettings["id"]);

    return (
        <div className="page_menu_row">
            <div className="current_page" id={pageSettings["id"]} key={pageSettings["id"]}>
                <p>{pageSettings["name"]}</p>
            </div>
            <div className="menu_wrap">

                <div className="menu_icon">
                    <MdAddCircleOutline/>
                    <div className="menu_content">
                        <ul className="page_menu">
                            <li>
                                <a onClick={(e) => {e.preventDefault(); setIsEditing(true) }} href="#">Add New Link</a>
                            </li>
                            { pageList.map((page) => {

                                return (

                                    <li id={page["id"]} key={page["id"]}>
                                        <a href={"/dashboard/pages/" + page["id"]}>{page["name"]}</a>
                                    </li>

                                )
                            })}
                        </ul>
                    </div>
                </div>

            </div>

            {isEditing ?
                <div className="edit_form popup new_page_form">
                    <div className="form_wrap">
                        <h3>Choose Your Link Name</h3>
                        <form className="new_page" onSubmit={handleSubmit}>
                            <input name="name" type="text"
                                   placeholder="Link Name"
                                   onChange={ checkPageName }
                                   onKeyPress={ event => {
                                       if(event.key === 'Enter') {
                                           handleSubmit(event);
                                       }
                                   }
                                   }
                            />

                            { available ?
                                <a className="submit_circle" href="#"
                                   onClick={(e) => handleSubmit(e)}
                                >
                                    <GiThumbUp />
                                </a>
                                :
                                <a className="cancel_icon" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       setIsEditing(false);
                                   }}
                                >
                                    <GiThumbDown />
                                </a>
                            }
                            <p className="status">{available ? "Available" : <span className="status not_available">Not Available</span>}</p>
                            <div className="my_row button_row">
                                <button className="button green" type="submit">
                                    Save
                                </button>
                                <a href="#" className="button red" onClick={(e) => {e.preventDefault(); setIsEditing(false); }}>
                                    Cancel
                                </a>
                            </div>
                        </form>
                    </div>

                </div>
                :
                ""
            }
        </div>
    );
}

export default PageNav;
