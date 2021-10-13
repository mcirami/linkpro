import React, {useContext, useState} from 'react';
import axios from 'axios';
import {MdAddCircleOutline} from 'react-icons/md';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import EventBus from '../../Utils/Bus';
import {PageContext} from '../App';

let pageNames = user.allPageNames;

const PageNav = ({ allUserPages, setAllUserPages, userSub, setShowUpgradePopup, setOptionText }) => {

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

    const handleClick = (e) => {
        e.preventDefault();

        if (userSub) {
            const {braintree_status, ends_at, name} = {...userSub};
            const currentDate = new Date().valueOf();
            const endsAt = new Date(ends_at).valueOf();

            if ((braintree_status === 'active' && name === "corporate") || endsAt > currentDate && name === "corporate") {
                setIsEditing(true);
            } else {
                setOptionText("add more links");

                setShowUpgradePopup(true);
                document.querySelector('#upgrade_popup').classList.add('open');
                setTimeout(() => {
                    document.querySelector('#upgrade_popup .close_popup').addEventListener('click', function(e) {
                        e.preventDefault();
                        setShowUpgradePopup(false);
                        document.querySelector('#upgrade_popup').classList.remove('open');
                    });
                }, 500);
            }

        } else {
            setShowUpgradePopup(true);
            document.querySelector('#upgrade_popup').classList.add('open');
            setOptionText("add more links");

            setTimeout(() => {
                document.querySelector('#upgrade_popup .close_popup').addEventListener('click', function(e) {
                    e.preventDefault();
                    setShowUpgradePopup(false);
                    document.querySelector('#upgrade_popup').classList.remove('open');
                });
            }, 500);
        }
    }

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
                                <a onClick={(e) => { handleClick(e) }} href="#">Add New Link</a>
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
                                    <FiThumbsUp />
                                </a>
                                :
                                <a className="cancel_icon" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       setIsEditing(false);
                                   }}
                                >
                                    <FiThumbsDown />
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
