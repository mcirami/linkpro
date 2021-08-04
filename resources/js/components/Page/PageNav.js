import React, {useState} from 'react';
import axios from 'axios';
import {MdAddCircleOutline, MdCancel} from 'react-icons/md';

const PageNav = ({ userPages, currentPage }) => {

    const [pages, setPages] = useState(userPages);
    const [isEditing, setIsEditing] = useState(false);
    const [newPageName, setNewPageName] = useState();

    const pageCount = pages.length;

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            name: newPageName,
        };

        axios.post('/dashboard/page/new', packets).then(
            response => {
                console.log(JSON.stringify(response.data));
                const page_id  = JSON.stringify(response.data.page_id);
                const newElement = {
                    id: page_id,
                    name: newPageName,
                };
                setPages(pages.concat(newElement));
                setIsEditing(false);

            },

        ).catch(error => {
            console.log("ERROR:: ", error.response.data);

        });
    };

    return (
        <ul className="page_nav_menu">
            { pages.map((page) => {

                return (

                    <li id={page["id"]} key={page["id"]}>
                        <a className={page["id"] === currentPage ? "active" : ""} href={"/dashboard/pages/" + page["id"]}>{page["name"]}</a>
                    </li>

                )
            })}

            { pageCount < 3 ?
                <li id={"new_" + pageCount + 1 } className="new_page">
                    { isEditing ?
                        <form>
                            <input name="name" type="text"
                                   placeholder="Link Name"
                                   onChange={(e) => setNewPageName(e.target.value) }
                                   onKeyPress={ event => {
                                        if(event.key === 'Enter') {
                                            handleSubmit(event);
                                            }
                                        }
                                    }
                            />
                            <a className="cancel_icon"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsEditing(false);
                                }}
                            >
                                <MdCancel />
                            </a>
                        </form>
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
