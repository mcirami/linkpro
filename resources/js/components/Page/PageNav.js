import React, {useState} from 'react';
import axios from 'axios';
import {MdAddCircleOutline, MdCancel, MdCheckCircle} from 'react-icons/md';
import EventBus from '../../Utils/Bus';

let pageNames = user.pageNames;

const PageNav = ({ allUserPages, setAllUserPages, currentPage }) => {

    //const [pages, setPages] = useState(userPages);
    const [isEditing, setIsEditing] = useState(false);
    const [newPageName, setNewPageName] = useState();
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

    return (
        <ul className="page_nav_menu">
            { allUserPages.map((page) => {

                return (

                    <li id={page["id"]} key={page["id"]}>
                        <a className={page["id"] === currentPage ? "active" : ""} href={"/dashboard/pages/" + page["id"]}>{page["name"]}</a>
                    </li>

                )
            })}

            { pageCount < 5 ?
                <li id={"new_" + pageCount + 1 } className="edit_form new_page">
                    { isEditing ?
                        <div>
                            <form className="new_page">
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

                                {available ?
                                    <a className="submit_circle" href="#"
                                       onClick={(e) => handleSubmit(e)}
                                    >
                                        <MdCheckCircle />
                                    </a>
                                :
                                    <a className="cancel_icon" href="#"
                                       onClick={(e) => {
                                           e.preventDefault();
                                           setIsEditing(false);
                                       }}
                                    >
                                        <MdCancel />
                                    </a>
                                }
                                <p className="status">{available ? "Available" : <span className="status not_available">Not Available</span>}</p>
                            </form>

                        </div>
                        :
                        <a key={"new_" + pageCount + 1} className="add_new_page" onClick={(e) => {e.preventDefault(); setIsEditing(true) }} href="#"><MdAddCircleOutline/></a>
                    }
                </li>
                : ""
            }
        </ul>
    );
}

export default PageNav;
