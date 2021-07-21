import React, {useState} from 'react';
import axios from 'axios';
import { MdAddCircleOutline } from 'react-icons/md';

const PageNav = ({userPages, currentPage}) => {

    const [pages, setPages] = useState(userPages);
    const [isEditing, setIsEditing] = useState(false);
    const [newPageName, setNewPageName] = useState();

    const pageCount = userPages.length;

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            name: newPageName,
        };

        axios.post('/dashboard/page/new', packets).then(
            response => console.log(JSON.stringify(response.data)),

        ).catch(error => {
            console.log("ERROR:: ", error.response.data["errors"]["name"][0]);

        });
    };

    return (
        <ul>
            {pages.map((page) => {

                return (

                    <li id={page["id"]} >
                        <a key={page["id"]} className={page["id"] === currentPage ? "active" : ""} href={"/dashboard/pages/" + page["id"]}>{page["name"]}</a>
                    </li>

                )
            })}

            {pageCount < 3 ?
                <li id={"new_" + pageCount + 1} >
                    {isEditing ?
                        <input type="text"
                               onChange={(e) => setNewPageName(e.target.value) }
                               onKeyPress={ event => {
                                    if(event.key === 'Enter') {
                                        handleSubmit(event);
                                        }
                                    }
                                }
                        />
                        :
                        <a key={"new_" + pageCount + 1} className="add_new_page" onClick={(e) => setIsEditing(true) } href="#"><MdAddCircleOutline/></a>
                    }
                </li>
                : ""
            }
        </ul>
    );
}

export default PageNav;
